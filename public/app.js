const fetchJobs = async () => {
    try {
        const response = await fetch("/job-search", {
            method: 'POST',
            body: JSON.stringify({
                description: $("#description").val(),
                fulltime: $("#fulltime").is(":checked"),
            })
        })
        const { results } = await response.json()

        return results
    }catch (error) {
        console.log(error)
    }
}

const createJobCard = (job) => {
  console.log(job)
  let jobHtml = `
    <div class"job-card">
      <div class="job-head">
        <h2>
          <a href="${job.company_url}">${job.company}</a>
        </h2>
        <h3>${job.title}</h3>
        <h3>${job.type}</h3>
        <h3<${job.locations}</h3>
      </div>
      <div class="job-body">
        ${job.description}
      </div>
      <div class="job-footer">
        <h4>
          ${job.how_to_apply}
        </h4>
      </div>
    </div>
  `
  jobHtml = $(jobHtml).data('job', job)
  return jobHtml
}
  
const renderJobs = async () => {
    const fetchedJobs = await fetchJobs()
    fetchedJobs.forEach(job => {
        const eachJob = createJobCard(job)
        $('#results').append(eachJob)
    })
}

$('#job-search').on('submit', function(event) {
  event.preventDefault()
  renderJobs()
  console.log("something")
})


async function fetchWeather() {
  if (!navigator || !navigator.geolocation) {
    $('#weather').append($('<h3>Weather not available on this browser</h3>'))
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { coords: { latitude, longitude } } = position;

    const response = await fetch(`/weather?lat=${ latitude }&lon=${ longitude }`);
    const { results } = await response.json();

    if (results.daily) {
      $('#weather').empty();

      results.daily.forEach(day => {
        const { weather: [{ icon }] } = day;

        $('#weather').append($(`
          <img src="http://openweathermap.org/img/wn/${ icon }@2x.png" />
        `));
      });
    }
  }, async (error) => {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    if (result.state == "denied") {
      $('#weather').html(
        $(`<div>
            <h3>You have denied access to location services.</h3>
            <h4>If you wish to see your forecast, update your settings and refresh.</h4>
          </div>`)
      )
    }
  });
}

fetchWeather();