-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 14, 2024 at 06:09 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `weatherdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `haldwani`
--

CREATE TABLE `haldwani` (
  `id` int(6) UNSIGNED NOT NULL,
  `Day_of_Week` varchar(15) DEFAULT NULL,
  `Day_and_Date` varchar(20) DEFAULT NULL,
  `Weather_Condition` varchar(50) DEFAULT NULL,
  `Weather_Icon` varchar(100) DEFAULT NULL,
  `Temperature` int(5) DEFAULT NULL,
  `Pressure` int(6) DEFAULT NULL,
  `Wind_Speed` decimal(5,2) DEFAULT NULL,
  `Humidity` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `haldwani`
--

INSERT INTO `haldwani` (`id`, `Day_of_Week`, `Day_and_Date`, `Weather_Condition`, `Weather_Icon`, `Temperature`, `Pressure`, `Wind_Speed`, `Humidity`) VALUES
(1, 'Wed', 'Feb 14, 2024', 'clear sky', '01n', 16, 1019, 2.29, 47);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `haldwani`
--
ALTER TABLE `haldwani`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `haldwani`
--
ALTER TABLE `haldwani`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
