export interface IUWConfig {
  cloudName: string;
  uploadPreset: string;
  multiple: boolean;
  maxImageFileSize: number;
  folder: string;
}

export interface IUWResult {
  event: string;
  info: {
    id: string;
    batchId: string;
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: unknown[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    folder: string;
    original_filename: string;
    path: string;
    thumbnail_url: string;
  };
}
