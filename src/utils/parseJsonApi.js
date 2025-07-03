// Utility to extract related objects from JSON:API response
export function findIncluded(included, type, id) {
  return included.find((item) => item.type === type && item.id === id);
}

export function findAllIncluded(included, type, ids) {
  return included.filter((item) => item.type === type && ids.includes(item.id));
}

// Example usage:
// const locality = findIncluded(included, 'locality', property.relationships.locality.data.id);
// const features = findAllIncluded(included, 'feature', property.relationships.features.data.map(f => f.id));
