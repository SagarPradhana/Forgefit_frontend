import { api } from "../utils/httputils";
import { API_ENDPOINTS } from "../utils/url";

export interface AppAttendanceStatsResponse {
  total_visits: number;
  avg_duration_in_hrs: number;
  current_streak: number;
}

export interface AppAttendanceResponse {
  id: string;
  user_id: string;
  user_name: string;
  date: number;
  status: string;
  check_in: number;
  check_out: number;
  duration: string;
  description: string;
  is_deleted: boolean;
  created_date: number;
  updated_date: number;
}

export interface PaginatedAppAttendanceResponse {
  count: number;
  totalcount: number;
  data: AppAttendanceResponse[];
}

export const appAttendanceService = {
  getAttendanceStats: async (userId: string, params: {
    from_date?: number;
    to_date?: number;
  }) => {
    const query = new URLSearchParams();
    if (params.from_date !== undefined) query.append("from_date", params.from_date.toString());
    if (params.to_date !== undefined) query.append("to_date", params.to_date.toString());

    const url = `${API_ENDPOINTS.APP.ATTENDANCE_STATS(userId)}?${query.toString()}`;
    return api.get(url) as Promise<AppAttendanceStatsResponse>;
  },

  getAttendance: async (userId: string, params: {
    from_date?: number;
    to_date?: number;
  }) => {
    const query = new URLSearchParams();
    if (params.from_date !== undefined) query.append("from_date", params.from_date.toString());
    if (params.to_date !== undefined) query.append("to_date", params.to_date.toString());

    const url = `${API_ENDPOINTS.APP.ATTENDANCE(userId)}?${query.toString()}`;
    return api.get(url) as Promise<PaginatedAppAttendanceResponse>;
  },
};
