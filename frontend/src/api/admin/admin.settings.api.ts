import api from "@/api/axios";
import {SettingType} from "@/types/SettingsType";

export type SettingsResponse = {
    items: SettingType[]
};

export type SettingItemResponse = {
    item: SettingType
};


export type SaveSettingResponse = {
    setting: SettingType
};

export async function getSettings(): Promise<SettingsResponse> {
    const response = await api.get<SettingsResponse>("/admin/settings");
    return response.data;
}


export async function getSetting(id: number): Promise<SettingItemResponse> {
    const response = await api.get<SettingItemResponse>(`/admin/settings/${id}`);
    return response.data;
}

export async function saveSettingRequest(
    data: SettingType
): Promise<SettingType> {
    const response = await api.post<SettingType | SaveSettingResponse>("/admin/settings/edit", data);
    return "setting" in response.data ? response.data.setting : response.data;
}
