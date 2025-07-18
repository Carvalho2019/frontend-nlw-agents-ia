import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GetRoomsQuestionsResponse } from "./types/get-rooms-questions-response";

export function useCreateQuestion(roomId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-question"],
    mutationFn: async (newQuestionData: { question: string }) => {
      const response = await fetch(`http://localhost:3333/rooms/${roomId}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuestionData),
      });
      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const result: { questionId: string, answer: string | null } = await response.json();
      return result;
    },
    onMutate({ question }) { //Executa no momento que for feita chamada p/ API
      const questions = queryClient.getQueryData<GetRoomsQuestionsResponse>(['get-questions', roomId])

      const questionArray = questions ?? []
      const newQuestion = {
        id: crypto.randomUUID(),
        question,
        answer: null,
        createdAt: new Date().toISOString(),
        isGeneratingAnswer: true
      }
      queryClient.setQueryData<GetRoomsQuestionsResponse>(['get-questions', roomId], [
        newQuestion,
        ...questionArray
      ])

      return { newQuestion, questions }
    },
    onSuccess: (data, _variables, context) => {
      // Invalidate the rooms query to refetch the list of rooms
      queryClient.setQueryData<GetRoomsQuestionsResponse>(
        ['get-questions', roomId],
        questions => {
          if (!questions) {
            return questions
          }
          if (!context?.newQuestion) {
            return questions
          }

          return questions.map(question => {
            if (question.id === context.newQuestion.id) {
              return {
                ...context.newQuestion,
                id: data.questionId,
                answer: data.answer,
                isGeneratingAnswer: false
              }
            }

            return question
          })
        }
      )


      queryClient.invalidateQueries({ queryKey: ["get-questions", roomId] });

      console.log("Room created successfully:", data);
    },
    onError: (error, _variables, context) => {
      if (context?.questions) {
        queryClient.setQueryData<GetRoomsQuestionsResponse>(
          ['get-questions', roomId], [
          ...context.questions,
        ])

      }
      console.error("Error creating room:", error);
    },
  });
}
