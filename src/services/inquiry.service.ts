import { apiClient } from "@/services/api-client"
import { ApiEventStatus, ApiEventType, useApiEventStore } from "@/stores";

export const submitQuery = async (data: any) => {
    const eventType = ApiEventType.SUBMIT_QUERY;
    const apiEventStore = useApiEventStore.getState();
    try {
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.IN_PROGRESS, spinner: true });
        await apiClient.post('/api/inquiry', data)
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.COMPLETED, spinner: true });
    } catch (error) {
        console.log(error);
    }
}

export const submitPrayerRequest = async (data: any) => {
    const eventType = ApiEventType.SUBMIT_PRAYER_REQUEST;
    const apiEventStore = useApiEventStore.getState();
    try {
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.IN_PROGRESS, spinner: true });
        await apiClient.post('/api/inquiry/prayer-requests', data)
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.COMPLETED, spinner: true });
    } catch (error) {
        console.log(error);
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.ERROR, spinner: false });
    }
}

export const submitCellGroupJoinRequest = async (data: any) => {
    const eventType = ApiEventType.SUBMIT_CELL_GROUP_JOIN;
    const apiEventStore = useApiEventStore.getState();
    try {
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.IN_PROGRESS, spinner: true });
        await apiClient.post('/api/inquiry/cell-groups', data)
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.COMPLETED, spinner: true });
    } catch (error) {
        console.log(error);
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.ERROR, spinner: false });
    }
}

export const submitEventInquiry = async (data: any, slug: string) => {
    const eventType = ApiEventType.SUBMIT_EVENT_INQUIRY;
    const apiEventStore = useApiEventStore.getState();
    try {
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.IN_PROGRESS, spinner: true });
        await apiClient.post(`/api/event/${slug}`, data)
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.COMPLETED, spinner: true });
    } catch (error) {
        console.log(error);
        apiEventStore.sendEvent({ type: eventType, status: ApiEventStatus.ERROR, spinner: false });
    }
}
