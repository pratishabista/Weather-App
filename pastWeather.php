<?php
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$apiKey = 'API_KEY';

$api_location = "haldwani";

function fetch_weather_data()
{
    global $api_location, $apiKey;

    $url = "https://api.openweathermap.org/data/2.5/weather?q=$api_location&appid=$apiKey&units=metric";

    $json_data = file_get_contents($url);
    $response_data = json_decode($json_data);

    if ($response_data === null || isset($response_data->cod) && $response_data->cod !== 200) {
        return false; // Returns false to indicate an error
    }

    if ($response_data->cod === 200) {
        $day_of_week = date('D');
        $day_and_date = date('M j, Y');
        $weather_condition = $response_data->weather[0]->description;
        $weather_icon = $response_data->weather[0]->icon;
        $temperature = $response_data->main->temp;
        $pressure = $response_data->main->pressure;
        $wind_speed = $response_data->wind->speed;
        $humidity = $response_data->main->humidity;

        return [
            "Day_of_Week" => $day_of_week,
            "Day_and_Date" => $day_and_date,
            "Weather_Condition" => $weather_condition,
            "Weather_Icon" => $weather_icon,
            "Temperature" => $temperature,
            "Pressure" => $pressure,
            "Wind_Speed" => $wind_speed,
            "Humidity" => $humidity
        ];
    }
}

function display_data()
{
    global $api_location;

    $weather_data = fetch_weather_data();

    if ($weather_data) {
        echo json_encode($weather_data);
    } else {
        echo json_encode(["error" => "Unable to fetch weather data."]);
    }
}

function connect_DB($api_location)
{
    $servername = "sql207.infinityfree.com";
    $username = "if0_35980621";
    $password = "UhkLpTgilQa";
    $dbname = "if0_35980621_weatherDB";

    $conn = new mysqli($servername, $username, $password);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql_create_db = "CREATE DATABASE IF NOT EXISTS $dbname";
    if ($conn->query($sql_create_db) !== TRUE) {
        echo "Error creating database: " . $conn->error;
    }

    $conn->select_db($dbname);

    $sql_create_table = "CREATE TABLE IF NOT EXISTS $api_location (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        Day_of_Week VARCHAR(15),
        Day_and_Date VARCHAR(20),
        Weather_Condition VARCHAR(50),
        Weather_Icon VARCHAR(100),
        Temperature INT(5),
        Pressure INT(6),
        Wind_Speed DECIMAL(5, 2),
        Humidity INT(5)
    )";
    if ($conn->query($sql_create_table) !== TRUE) {
        echo "Error creating table: " . $conn->error;
    }

    $weather_data = fetch_weather_data();
    if ($weather_data) {
        $day_of_week = $weather_data["Day_of_Week"];
        $day_and_date = $weather_data["Day_and_Date"];
        $weather_condition = $weather_data["Weather_Condition"];
        $weather_icon = $weather_data["Weather_Icon"];
        $temperature = $weather_data["Temperature"];
        $pressure = $weather_data["Pressure"];
        $wind_speed = $weather_data["Wind_Speed"];
        $humidity = $weather_data["Humidity"];

        $sql_select = "SELECT * FROM $api_location WHERE Day_of_Week = '$day_of_week'";
        $result = $conn->query($sql_select);

        if ($result->num_rows == 0) {
            // Insert data
            $sql_insert = "INSERT INTO $api_location (Day_of_Week, Day_and_Date, Weather_Condition, Weather_Icon, Temperature, Pressure, Wind_Speed, Humidity)
                           VALUES ('$day_of_week', '$day_and_date', '$weather_condition', '$weather_icon', $temperature, $pressure, $wind_speed, $humidity)";
            if ($conn->query($sql_insert) !== TRUE) {
                echo "Error inserting data: " . $conn->error;
            }
        } else {
           
            $sql_update = "UPDATE $api_location
                           SET Day_and_Date='$day_and_date', Weather_Condition='$weather_condition', Weather_Icon='$weather_icon', Temperature=$temperature, Pressure=$pressure, Wind_Speed=$wind_speed, Humidity=$humidity
                           WHERE Day_of_Week='$day_of_week'";
            if ($conn->query($sql_update) !== TRUE) {
                echo "Error updating data: " . $conn->error;
            }
        }
    } else {
        echo "Unable to fetch weather data.";
    }

    $sql_display = "SELECT * FROM $api_location";
    $result = $conn->query($sql_display);

    $data = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
    } else {
        echo "0 results";
    }

    $conn->close();
}

connect_DB($api_location);
?>
