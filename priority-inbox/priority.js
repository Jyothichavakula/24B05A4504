const priorityWeight = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function getTopNotifications(notifications, limit = 10) {
  return notifications
    .map((notification) => ({
      ...notification,
      score: priorityWeight[notification.Type] || 0,
    }))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return new Date(b.Timestamp) - new Date(a.Timestamp);
    })
    .slice(0, limit);
}

module.exports = getTopNotifications;