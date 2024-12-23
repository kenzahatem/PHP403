export function removeDuplicatesByID(items: any[]) {
    const seen = new Set();
    return items.filter((item) => {
      if (!item?.ID) {
        // If an item has no ID, you can skip or keep it by policy
        // For demonstration, let's keep items that have no ID
        return true;
      }
      if (seen.has(item.ID)) {
        return false;
      }
      seen.add(item.ID);
      return true;
    });
  }