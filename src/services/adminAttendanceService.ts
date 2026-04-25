import { api } from "../utils/httputils";
import { API_ENDPOINTS } from "../utils/url";

export interface AttendanceRequest {
  user_id: string;
  status: string;
  description?: string;
  date: number; // Unix timestamp
  check_in: number; // Unix timestamp
  check_out?: number; // Unix timestamp
}

export interface AttendanceResponse {
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

export interface AttendanceStatsResponse {
  code: number;
  data: {
    total_checkins_today: number;
    present_now: number;
    checked_out_today: number;
    avg_time_hours: number;
  };
}

export interface PaginatedAttendanceResponse {
  code: number;
  mCode: string;
  message: string;
  count: number;
  totalcount: number;
  data: AttendanceResponse[];
}

export interface CommonAttendanceResponse {
  code: number;
  mCode: string;
  message: string;
  data: any;
}

export const adminAttendanceService = {
  getAttendance: async (params: {
    id?: string;
    user_id?: string;
    from_date?: number;
    to_date?: number;
    status?: string;
    search?: string;
    is_deleted?: boolean;
    count?: number;
    offset?: number;
    order_by?: string;
    order_dir?: "ASC" | "DESC";
  }) => {
    const query = new URLSearchParams();
    if (params.id) query.append("id", params.id);
    if (params.user_id) query.append("user_id", params.user_id);
    if (params.from_date) query.append("from_date", params.from_date.toString());
    if (params.to_date) query.append("to_date", params.to_date.toString());
    if (params.status) query.append("status", params.status);
    if (params.search) query.append("search", params.search);
    if (params.is_deleted !== undefined) query.append("is_deleted", params.is_deleted.toString());
    if (params.count) query.append("count", params.count.toString());
    if (params.offset !== undefined) query.append("offset", params.offset.toString());
    if (params.order_by) query.append("order_by", params.order_by);
    if (params.order_dir) query.append("order_dir", params.order_dir);

    const url = `${API_ENDPOINTS.ADMIN.ATTENDANCE}?${query.toString()}`;
    return api.get(url) as Promise<PaginatedAttendanceResponse>;
  },

  createAttendance: async (data: AttendanceRequest) => {
    return api.post(API_ENDPOINTS.ADMIN.ATTENDANCE, data) as Promise<CommonAttendanceResponse>;
  },

  getStats: async (from_date?: number, to_date?: number) => {
    const query = new URLSearchParams();
    if (from_date) query.append("from_date", from_date.toString());
    if (to_date)   query.append("to_date",   to_date.toString());
    const url = `${API_ENDPOINTS.ADMIN.ATTENDANCE_STATS}${query.toString() ? '?' + query.toString() : ''}`;
    return api.get(url) as Promise<AttendanceStatsResponse>;
  },

  updateAttendance: async (id: string, userId: string, data: Partial<AttendanceRequest>) => {
    return api.patch(API_ENDPOINTS.ADMIN.ATTENDANCE_EDIT(id, userId), data) as Promise<CommonAttendanceResponse>;
  },

  deleteAttendance: async (id: string) => {
    return api.delete(API_ENDPOINTS.ADMIN.ATTENDANCE_DETAIL(id)) as Promise<CommonAttendanceResponse>;
  },

  getUserAttendance: async (userId: string, params: { from_date?: number; to_date?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.from_date) query.append("from_date", params.from_date.toString());
    if (params.to_date) query.append("to_date", params.to_date.toString());

    const url = `${API_ENDPOINTS.ADMIN.ATTENDANCE_USER(userId)}?${query.toString()}`;
    return api.get(url) as Promise<PaginatedAttendanceResponse>;
  },
};
