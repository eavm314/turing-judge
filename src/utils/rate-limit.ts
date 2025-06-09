export const rateLimiter = ({ limit, interval }: { limit: number; interval: number }) => {
  const requests = new Map();
  return (userId: string) => {
    if (!requests.has(userId)) {
      requests.set(userId, { count: 0, firstRequest: Date.now() });
    }
    const data = requests.get(userId);
    if (Date.now() - data.firstRequest > interval) {
      data.count = 0;
      data.firstRequest = Date.now();
    }
    data.count += 1;
    if (data.count > limit) {
      return false;
    }
    requests.set(userId, data);
    return true;
  };
};
