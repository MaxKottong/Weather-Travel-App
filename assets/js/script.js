var apiKey = "KTGJCNE6ME6PS52XDXURA4MKV";
var city = "";

var currentWeather = [];
var forecast = [];
var dateFormat = "MM/DD/YY";

var getForecast = function (location) {
    city = location;

    var apiUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/forecast?locations=" + city + "&aggregateHours=24&forecastDays=6&contentType=json&iconSet=icons2&shortColumnNames=true&key=" + apiKey;

    console.log(apiUrl);

        fetch(apiUrl).then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {

                    if (data.errorCode === 999) {
                        //modal error
                        return false;
                    }

                    currentWeather = data.locations;

                    city = currentWeather[Object.keys(currentWeather)[0]].address;
                    forecast = currentWeather[Object.keys(currentWeather)[0]].values;
                    currentWeather = currentWeather[Object.keys(currentWeather)[0]].currentConditions;

                    todaysConditions();
                    setForecast();
                    addRecentSearch();
                })
            } else {
                //modal error
            }
        })
}

var todaysConditions = function () {
    var uv = parseInt(forecast[0].uvindex);
    var uvEl = $("#todaysUv").text(uv);

    $("#city-searched").text(city);
    $("#todays-date").text("(" + dayjs().format(dateFormat) + ")");
    $("#weather-icon").attr("src", getIcon(forecast[0].conditions))
    $("#todays-temp").text(currentWeather.temp + " \xB0F");
    $("#todays-wind").text(currentWeather.wspd + "MPH");
    $("todays-humidity").text(currentWeather.humidity + "%");

    if (uv <= 2) {
        uvEl.addClass("bg-success px-2 shadow-sm rounded");
    } else if (uv <= 6) {
        uvEl.addClass("bg-warning px-2 shadow-sm rounded");
    } else {
        uvEl.addClass("bg-danger px-2 shadow-sm rounded");
    }
}

var setForecast = function () {
    var forecastsEl = $("#forecasts");

    forecastsEl.children().remove();

    for (var i = 1; i < forecast.length; i++) {
        var dayEl = $("<div>")
            .addClass("rounded mt-2 col-5 col-md-5 col-xl-2 bg-dark text-light pt-1")
            .attr("id", i + "-day");

        var date = $("<p>")
            .text(dayJs().add(i, 'days').format(dateFormat))
            .addClass("h5");
        dayEl.append(date);

        var icon = $("<img>")
            .text(forecast[i].conditions)
            .attr("src", getIcon(forecast[i].conditions))
            .attr("alt", forecast[i].conditions);
        dayEl.append(icon);

        var temp = $("<p>")
            .text("Temp: " + forecast[i].temp + " \xB0F");
        dayEl.append(temp);

        var wind = $("<p>")
            .text("Wind: " + forecast[i].wspd + " MPH");
        dayEl.append(wind);

        var humidity = $("<p>")
            .text("Humidity: " + forecast[i].humidity + "%");
        dayEl.append(humidity);

        container.append(dayEl);
    }
}

var navEl = $("nav").on("click", function (event) {
    var targetEl = $(event.target);

    if (targetEl.attr("id") === "search") {
        var location = $("#city").val();
        if (location) {
            getForeCast(location);
        }
        else {
            //modal error
        }
        $("#city").val("");

    } else if (targetEl.attr("class").includes("special-btn")) {
        getForecast(targetEl.attr("id").replace("-", ","));
    }

});

var getIcon = function (condition) {
    switch (condition.toLowerCase()) {
        case "rain":
        case "rain, partially cloudy":
        case "rain, overcast":
            return "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/rain.png";
        case "partially cloudy":
            return "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/partly-cloudy-day.png";
        case "overcast":
            return "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/cloudy.png";
        default:
            return "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/clear-day.png";
    }
}