-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 09, 2021 at 05:06 AM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chat`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `sender` varchar(20) NOT NULL,
  `message` varchar(100) NOT NULL,
  `time` bigint(20) NOT NULL,
  `key` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chat`
--

INSERT INTO `chat` (`sender`, `message`, `time`, `key`) VALUES
('Gagan', 'Hiiiiiii', 1610973821493, 0),
('Gagan', 'Holaaa', 1610978045, 1),
('Ganesh', 'Holaaa', 1610976045, 2),
('Gagan', 'ye ye', 1610979890000, 3),
('Gagan', 'hhh', 1610979839000, 4),
('Gagan', 'Ayyoiiiiiiii', 1610979905000, 5),
('Gagan', 'adipoli', 1610979918000, 6),
('Gagan', 'Set Set', 1610979926000, 7),
('Gagan', 'just t', 1610980144000, 8),
('Gagan', 'shoooooooooo', 1610980177000, 9),
('Gagan', 'hol', 1610980253000, 10),
('Gagan', 'yeye', 1610980599000, 11),
('Gagan', 'hoi', 1610980910000, 12),
('Gagan', 'hii', 1610981134000, 13),
('Anonymous', 'yeye', 1610981389000, 14),
('Haya', 'Hloooooo', 1610982680000, 15),
('Hanabi', 'Hiii', 1611035883000, 16),
('Hayabusa', 'How r u', 1611035892000, 17),
('Hanabi', 'Fine Fine', 1611035900000, 18),
('Hayabusa', 'hiii', 1611036168000, 19),
('Anonymous', 'hoooooooooi', 1611036210000, 20),
('Hayabusa', 'Shee', 1611036235000, 21),
('Hanabii', 'Power', 1611036246000, 22),
('Hayabusa', 'set set', 1611036274000, 23);

-- --------------------------------------------------------

--
-- Table structure for table `update_details`
--

CREATE TABLE `update_details` (
  `name` varchar(20) NOT NULL,
  `timestamp` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `update_details`
--

INSERT INTO `update_details` (`name`, `timestamp`) VALUES
('chat', 1611036274100);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD UNIQUE KEY `key` (`key`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
