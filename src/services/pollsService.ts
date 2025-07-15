import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type PollSurvey = Database["public"]["Tables"]["polls_surveys"]["Row"];
type PollOption = Database["public"]["Tables"]["poll_options"]["Row"];
type SurveyQuestion = Database["public"]["Tables"]["survey_questions"]["Row"];

export interface PollWithOptions extends PollSurvey {
  poll_options?: PollOption[];
  survey_questions?: SurveyQuestion[];
  total_responses?: number;
  user_has_voted?: boolean;
  results?: {
    option_id: string;
    option_text: string;
    vote_count: number;
    percentage: number;
  }[];
}

export interface CreatePollData {
  title: string;
  description: string;
  type: "poll" | "survey";
  endDate: string;
  targetAudience: "all" | "owners" | "tenants" | "specific";
  options?: string[]; // For polls
  questions?: {
    text: string;
    type: "single_choice" | "multiple_choice" | "text" | "rating";
    options?: string[];
    required: boolean;
  }[]; // For surveys
}

export interface VotePollData {
  pollId: string;
  optionId: string;
}

export interface SubmitSurveyData {
  pollId: string;
  responses: {
    questionId: string;
    responseText?: string;
    selectedOptions?: string[];
    rating?: number;
  }[];
}

// Fetch all polls and surveys for a society
export async function fetchPollsSurveys(
  societyId: string
): Promise<PollWithOptions[]> {
  try {
    const { data, error } = await supabase
      .from("polls_surveys")
      .select(
        `
        *,
        poll_options (
          id,
          option_text,
          option_order
        ),
        survey_questions (
          id,
          question_text,
          question_type,
          question_order,
          required,
          options
        )
      `
      )
      .eq("society_id", societyId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Enhance with participation and results data
    const enhancedData = await Promise.all(
      (data || []).map(async (poll) => {
        // Get total responses count
        const { count: totalResponses } = await supabase
          .from("poll_survey_participants")
          .select("*", { count: "exact", head: true })
          .eq("poll_id", poll.id)
          .eq("completed", true);

        // Check if current user has voted
        let userHasVoted = false;
        if (user) {
          const { data: participation } = await supabase
            .from("poll_survey_participants")
            .select("completed")
            .eq("poll_id", poll.id)
            .eq("resident_id", user.id)
            .single();

          userHasVoted = participation?.completed || false;
        }

        // Get poll results if it's a poll
        let results = undefined;
        if (poll.type === "poll" && poll.status !== "draft") {
          const { data: pollResults, error: resultsError } = await supabase.rpc(
            "get_poll_results",
            { poll_uuid: poll.id }
          );

          if (!resultsError) {
            results = pollResults;
          }
        }

        return {
          ...poll,
          total_responses: totalResponses || 0,
          user_has_voted: userHasVoted,
          results,
        };
      })
    );

    return enhancedData;
  } catch (error) {
    console.error("Error fetching polls/surveys:", error);
    throw error;
  }
}

// Create a new poll or survey
export async function createPollSurvey(
  societyId: string,
  data: CreatePollData
): Promise<string> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Create the poll/survey
    const { data: poll, error: pollError } = await supabase
      .from("polls_surveys")
      .insert({
        society_id: societyId,
        title: data.title,
        description: data.description,
        type: data.type,
        end_date: data.endDate,
        target_audience: data.targetAudience,
        created_by: user.id,
        status: "active", // Default to active
      })
      .select()
      .single();

    if (pollError) throw pollError;

    // If it's a poll, create options
    if (data.type === "poll" && data.options) {
      const optionsData = data.options.map((option, index) => ({
        poll_id: poll.id,
        option_text: option,
        option_order: index + 1,
      }));

      const { error: optionsError } = await supabase
        .from("poll_options")
        .insert(optionsData);

      if (optionsError) throw optionsError;
    }

    // If it's a survey, create questions
    if (data.type === "survey" && data.questions) {
      const questionsData = data.questions.map((question, index) => ({
        poll_id: poll.id,
        question_text: question.text,
        question_type: question.type,
        question_order: index + 1,
        required: question.required,
        options: question.options || null,
      }));

      const { error: questionsError } = await supabase
        .from("survey_questions")
        .insert(questionsData);

      if (questionsError) throw questionsError;
    }

    return poll.id;
  } catch (error) {
    console.error("Error creating poll/survey:", error);
    throw error;
  }
}

// Vote on a poll
export async function votePoll(data: VotePollData): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Check if user can vote
    const { data: canVote } = await supabase.rpc("can_user_vote", {
      poll_uuid: data.pollId,
      user_uuid: user.id,
    });

    if (!canVote) {
      throw new Error("You cannot vote on this poll");
    }

    // Start transaction-like operations
    // First, insert the poll response
    const { error: responseError } = await supabase
      .from("poll_responses")
      .insert({
        poll_id: data.pollId,
        option_id: data.optionId,
        resident_id: user.id,
      });

    if (responseError) throw responseError;

    // Then, mark participation as completed
    const { error: participationError } = await supabase
      .from("poll_survey_participants")
      .upsert({
        poll_id: data.pollId,
        resident_id: user.id,
        completed: true,
        completed_at: new Date().toISOString(),
      });

    if (participationError) throw participationError;
  } catch (error) {
    console.error("Error voting on poll:", error);
    throw error;
  }
}

// Submit survey responses
export async function submitSurvey(data: SubmitSurveyData): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Check if user can vote
    const { data: canVote } = await supabase.rpc("can_user_vote", {
      poll_uuid: data.pollId,
      user_uuid: user.id,
    });

    if (!canVote) {
      throw new Error("You cannot submit responses to this survey");
    }

    // Insert all survey responses
    const responsesData = data.responses.map((response) => ({
      poll_id: data.pollId,
      question_id: response.questionId,
      resident_id: user.id,
      response_text: response.responseText || null,
      selected_options: response.selectedOptions || null,
      rating: response.rating || null,
    }));

    const { error: responsesError } = await supabase
      .from("survey_responses")
      .insert(responsesData);

    if (responsesError) throw responsesError;

    // Mark participation as completed
    const { error: participationError } = await supabase
      .from("poll_survey_participants")
      .upsert({
        poll_id: data.pollId,
        resident_id: user.id,
        completed: true,
        completed_at: new Date().toISOString(),
      });

    if (participationError) throw participationError;
  } catch (error) {
    console.error("Error submitting survey:", error);
    throw error;
  }
}

// Update poll/survey status
export async function updatePollStatus(
  pollId: string,
  status: "draft" | "active" | "closed"
): Promise<void> {
  try {
    const { error } = await supabase
      .from("polls_surveys")
      .update({ status })
      .eq("id", pollId);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating poll status:", error);
    throw error;
  }
}

// Delete poll/survey
export async function deletePollSurvey(pollId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("polls_surveys")
      .delete()
      .eq("id", pollId);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting poll/survey:", error);
    throw error;
  }
}

// Subscribe to real-time updates for polls/surveys
export function subscribeToPollsSurveys(
  societyId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel("polls_surveys_changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "polls_surveys",
        filter: `society_id=eq.${societyId}`,
      },
      callback
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "poll_responses",
      },
      callback
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "survey_responses",
      },
      callback
    )
    .subscribe();
}
