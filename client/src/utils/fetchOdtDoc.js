// import host from '../host';

const url = `${process.env.REACT_APP_API_URL}/createdoc`;

export default async function fetchOdtDoc(
  event,
  idSchedule,
  adminEmail,
  currentLanguage,
) {
  event.preventDefault();

  const urlDownload = `${process.env.REACT_APP_API_URL}/download/schedule_${adminEmail}.odt`;

  const options = {
    method: 'post',
    credentials: 'include',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: `idschedule=${idSchedule}&owner=${adminEmail}&lang=${currentLanguage}`,
  };

  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          alert('Schedule not found, please retry');
        }
      }
      return response;
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.created) {
        setTimeout(() => {
          window.location.href = urlDownload;
        }, 0);
      }
    })
    .catch((error) => {
      alert(`Server doesn't response - ${error}`);
    });
}
