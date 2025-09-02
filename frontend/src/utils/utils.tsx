export const dateInSGT = (date: Date) => {
    return new Intl.DateTimeFormat('en-SG', {
      timeZone: 'Asia/Singapore',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };