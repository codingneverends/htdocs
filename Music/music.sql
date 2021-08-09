-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 26, 2021 at 08:47 AM
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
-- Database: `music`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `value` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`user_id`, `product_id`, `value`) VALUES
(70118, 224542, 'Awsome'),
(337927, 224542, 'Nice one'),
(337927, 349544, 'awsome'),
(185682, 224542, 'Awsome'),
(70118, 224542, 'Nice Guitar');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `uuid` int(11) NOT NULL,
  `cat` varchar(30) NOT NULL,
  `brand` varchar(30) NOT NULL,
  `status` int(11) NOT NULL,
  `chars` varchar(30) NOT NULL,
  `yof` int(11) NOT NULL,
  `image` varchar(100) NOT NULL,
  `price` int(11) NOT NULL,
  `price_o` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`uuid`, `cat`, `brand`, `status`, `chars`, `yof`, `image`, `price`, `price_o`) VALUES
(68074, 'drum', 'xyz', 1, 'char3', 2011, 'http://localhost/upload_music/product68074', 15, 16),
(166043, 'drum', 'abc', 0, 'char2', 2007, 'http://localhost/upload_music/product166043', 10, 11),
(224542, 'guitar', 'abc', 1, 'char2', 2013, 'http://localhost/upload_music/product224542', 10, 13),
(327374, 'piano', 'abc', 1, 'char3', 2011, 'http://localhost/upload_music/product327374', 10, 11),
(349544, 'flute', 'abc', 1, 'char2', 2008, 'http://localhost/upload_music/product349544', 12, 13),
(515848, 'guitar', 'xyz', 1, 'char1', 2007, 'http://localhost/upload_music/product515848', 10, 12),
(582684, 'piano', 'xyz', 1, 'char2', 2010, 'http://localhost/upload_music/product582684', 8, 10),
(802256, 'violin', 'abc', 1, 'char2', 2013, 'http://localhost/upload_music/product802256', 13, 15),
(863175, 'violin', 'xyz', 0, 'char1', 2012, 'http://localhost/upload_music/product863175', 12, 13),
(976307, 'flute', 'abc', 1, 'char2', 2006, 'http://localhost/upload_music/product976307', 8, 9),
(977037, 'harp', 'abc', 1, 'char2', 2009, 'http://localhost/upload_music/product977037jpg', 10, 13);

-- --------------------------------------------------------

--
-- Table structure for table `rent`
--

CREATE TABLE `rent` (
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `days` int(11) NOT NULL,
  `ret_date` int(11) NOT NULL,
  `startdate` varchar(20) NOT NULL,
  `uuid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rent`
--

INSERT INTO `rent` (`user_id`, `product_id`, `days`, `ret_date`, `startdate`, `uuid`) VALUES
(337927, 166043, 90, 90, '1612936053364', 3578),
(337927, 166043, 60, 0, '1621945689096', 226386),
(337927, 863175, 60, 0, '1615949664235', 691732),
(337927, 863175, 60, 197, '1604943327148', 836611);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `uuid` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `namel` varchar(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `imgurl` varchar(100) NOT NULL DEFAULT 'nil',
  `password` varchar(30) NOT NULL,
  `phno` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`uuid`, `name`, `namel`, `email`, `role`, `imgurl`, `password`, `phno`) VALUES
(70118, 'Crimson Shadow', 'Hayabusa', 'hayabusa@gmail.com', 'admin', 'http://localhost/upload_music/profilepic70118.jpg', 'Pass1234', '+34 7683425647'),
(185682, 'Cat Girl', 'Ruby', 'ruby@gmail.com', 'user', 'http://localhost/upload_music/profilepic185682.png', 'Pass1234', '+34 6782935476'),
(337927, 'Scarlet Flower', 'Hanabi', 'hanabi@gmail.com', 'user', 'http://localhost/upload_music/profilepic337927.png', 'Pass1234', '+34 5672345678');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`uuid`);

--
-- Indexes for table `rent`
--
ALTER TABLE `rent`
  ADD PRIMARY KEY (`uuid`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `rent_ibfk_2` (`user_id`);

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
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`uuid`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`uuid`);

--
-- Constraints for table `rent`
--
ALTER TABLE `rent`
  ADD CONSTRAINT `rent_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`uuid`),
  ADD CONSTRAINT `rent_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`uuid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
