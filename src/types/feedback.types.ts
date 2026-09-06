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

export interface AdminFeedback {
  feedbackId: number;
  content: string;
  date: string;
  isSuccess: boolean;
  time: string;
  username: string;
}

export interface AdminFeedbackListData {
  content: AdminFeedback[];
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface FeedbackDetailData {
  feedbackId: number;
  date: string;
  time: string;
  isSuccess: boolean;
  wasteType: string;
  title: string;
  videoUrl: string;
  content: string;
}

export interface FeedbackDetectionData {
  clientId: string;
}
