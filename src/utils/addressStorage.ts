export interface SavedAddress {
  _id: string;
  userId: string;
  type: string;
  name: string;
  phone: string;
  additionalPhone?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  createdAt?: string;
  updatedAt?: string;
}

const STORAGE_KEY = "stylehub_addresses";

export function getSavedAddresses(): Record<string, SavedAddress> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return {};
    }

    const parsed = JSON.parse(stored);

    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
    ) {
      return parsed;
    }

    return {};
  } catch (error) {
    console.error("Failed to load addresses:", error);
    return {};
  }
}

export function saveAddress(
  address: SavedAddress
): Record<string, SavedAddress> {
  try {
    const existing = getSavedAddresses();

    const updated = {
      ...existing,
      [address.type]: address,
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );

    return updated;
  } catch (error) {
    console.error("Failed to save address:", error);
    throw error;
  }
}

export function deleteAddress(
  type: string
): Record<string, SavedAddress> {
  try {
    const existing = getSavedAddresses();

    delete existing[type];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(existing)
    );

    return existing;
  } catch (error) {
    console.error("Failed to delete address:", error);
    throw error;
  }
}

export function clearSavedAddresses() {
  localStorage.removeItem(STORAGE_KEY);
}