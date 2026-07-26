export interface PageRequest {
  page: number;
  pageSize: number;
}

export interface Feedback {
  feedbackId: number;
  date: string;
  time: string;
  isSuccess: boolean;
  wasteType: string;
  feedbackText: string;
}

export interface FeedbackListData {
  content: Feedback[];
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
