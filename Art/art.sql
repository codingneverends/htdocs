-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 23, 2021 at 07:02 PM
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
-- Database: `art`
--

-- --------------------------------------------------------

--
-- Table structure for table `artworks`
--

CREATE TABLE `artworks` (
  `uuid` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `description` varchar(200) NOT NULL,
  `fileurl` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `artworks`
--

INSERT INTO `artworks` (`uuid`, `name`, `description`, `fileurl`, `user_id`) VALUES
(918727, 'Kagu', 'In the flower season', 'http://localhost/upload_art/artwork5109674760793.jpg', 60793);

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `class_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`class_id`, `user_id`, `status`) VALUES
(151346, 631111, 1),
(328156, 631111, 1);

-- --------------------------------------------------------

--
-- Table structure for table `class`
--

CREATE TABLE `class` (
  `uuid` int(11) NOT NULL,
  `artist_id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `timestamp` varchar(20) NOT NULL,
  `description` varchar(200) NOT NULL,
  `duration` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `review` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `class`
--

INSERT INTO `class` (`uuid`, `artist_id`, `name`, `timestamp`, `description`, `duration`, `price`, `review`) VALUES
(142048, 60793, 'Demo_0', '1619865000000', 'testing past', 50, 30, 'It was nice class , well prepared.'),
(151346, 60793, 'Demo2', '1622457000000', 'another demo class', 40, 80, ''),
(328156, 60793, 'Demo', '1622367000000', 'This is a demo class', 40, 50, '');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `class_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `value` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`class_id`, `user_id`, `value`) VALUES
(142048, 332844, 'nice class'),
(151346, 60793, 'now ok'),
(151346, 60793, 'Thanks for this oppertunity');

-- --------------------------------------------------------

--
-- Table structure for table `teaching`
--

CREATE TABLE `teaching` (
  `uuid` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `name` varchar(40) NOT NULL,
  `description` varchar(200) NOT NULL,
  `fileurl` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `teaching`
--

INSERT INTO `teaching` (`uuid`, `class_id`, `name`, `description`, `fileurl`) VALUES
(700260, 328156, 'PUBG', 'Bullet incoming', 'http://localhost/upload_art/teachingmaterialspubg72328156.jpg'),
(855565, 328156, 'Dragon', 'To the palace', 'http://localhost/upload_art/teachingmaterialsdragon86328156.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `uuid` int(11) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `verified` int(11) NOT NULL DEFAULT 0,
  `name` varchar(30) NOT NULL,
  `imgurl` varchar(100) NOT NULL DEFAULT 'nil'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`uuid`, `email`, `password`, `role`, `verified`, `name`, `imgurl`) VALUES
(60793, 'kagura@gmail.com', 'Pass1234', 'artist', 2, 'Kagura', 'http://localhost/upload_art/profilepic60793.jpg'),
(332844, 'hayabusa@gmail.com', 'Pass1234', 'manager', 1, 'Hayabusa', 'http://localhost/upload_art/profilepic332844.jpg'),
(421340, 'hanabi@gmail.com', 'Pass1234', 'artist', 2, 'Hanabi', 'http://localhost/upload_art/profilepic421340.png'),
(631111, 'hanzo@gmail.com', 'Pass1234', 'user', 1, 'Hanzo', 'http://localhost/upload_art/profilepic631111.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `artworks`
--
ALTER TABLE `artworks`
  ADD PRIMARY KEY (`uuid`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`class_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`uuid`),
  ADD KEY `artist_id` (`artist_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD KEY `class_id` (`class_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `teaching`
--
ALTER TABLE `teaching`
  ADD PRIMARY KEY (`uuid`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`uuid`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `artworks`
--
ALTER TABLE `artworks`
  ADD CONSTRAINT `artworks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`uuid`);

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `class` (`uuid`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`uuid`);

--
-- Constraints for table `class`
--
ALTER TABLE `class`
  ADD CONSTRAINT `class_ibfk_1` FOREIGN KEY (`artist_id`) REFERENCES `user` (`uuid`);

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `class` (`uuid`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`uuid`);

--
-- Constraints for table `teaching`
--
ALTER TABLE `teaching`
  ADD CONSTRAINT `teaching_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `class` (`uuid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
