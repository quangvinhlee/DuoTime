import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

export interface FileUploadData {
  uri: string;
  type: string;
  name: string;
  size: number;
}

export const pickImage = async (): Promise<FileUploadData | null> => {
  try {
    // Request permissions
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return null;
      }
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for avatars
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const asset = result.assets[0];

      return {
        uri: asset.uri,
        type: asset.type || "image/jpeg",
        name: asset.fileName || "avatar.jpg",
        size: asset.fileSize || 0,
      };
    }

    return null;
  } catch (error) {
    console.error("Error picking image:", error);
    return null;
  }
};

export const takePhoto = async (): Promise<FileUploadData | null> => {
  try {
    // Request permissions
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
        return null;
      }
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for avatars
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const asset = result.assets[0];

      return {
        uri: asset.uri,
        type: asset.type || "image/jpeg",
        name: asset.fileName || "avatar.jpg",
        size: asset.fileSize || 0,
      };
    }

    return null;
  } catch (error) {
    console.error("Error taking photo:", error);
    return null;
  }
};

export const validateImageFile = (file: FileUploadData): string | null => {
  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    return "File too large. Maximum size is 5MB.";
  }

  // Check file type
  if (!file.type.startsWith("image/")) {
    return "Only image files are allowed.";
  }

  return null;
};

export const convertToBase64 = async (
  file: FileUploadData
): Promise<string> => {
  const response = await fetch(file.uri);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:image/jpeg;base64, prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
