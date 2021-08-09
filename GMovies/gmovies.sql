-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 09, 2021 at 05:05 AM
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
-- Database: `gmovies`
--

-- --------------------------------------------------------

--
-- Table structure for table `generes`
--

CREATE TABLE `generes` (
  `movie_id` int(11) NOT NULL,
  `string` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `generes`
--

INSERT INTO `generes` (`movie_id`, `string`) VALUES
(664882, 'action'),
(664882, 'entertainment');

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

CREATE TABLE `movies` (
  `uuid` int(11) NOT NULL,
  `title` varchar(40) NOT NULL,
  `description` varchar(200) NOT NULL,
  `off_url` varchar(100) NOT NULL,
  `imgurl` varchar(100) NOT NULL,
  `tra_url` varchar(100) NOT NULL,
  `year` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`uuid`, `title`, `description`, `off_url`, `imgurl`, `tra_url`, `year`) VALUES
(20391, 'Wonder Woman', 'When a pilot crashes and tells of conflict in the outside world, Diana, an Amazonian warrior in training, leaves home to fight a war, discovering her full powers and true destiny.', 'https://www.imdb.com/title/tt0451279/', 'http://localhost/uploads/movies/20391.jpg', 'https://www.youtube.com/watch?v=1Q8fG0TtVAY', 2017),
(664882, 'SpiderMan HomeComing', 'Peter Parker balances his life as an ordinary high school student in Queens with his superhero alter-ego Spider-Man, and finds himself on the trail of a new menace prowling the skies of New York City.', 'https://www.imdb.com/title/tt2250912/', 'http://localhost/uploads/movies/664882.jpg', 'https://www.youtube.com/watch?v=U0D3AOldjMU', 2017),
(761730, 'Hulk', 'Bruce Banner, a genetics researcher with a tragic past, suffers an accident that causes him to transform into a raging green monster when he gets angry', 'https://www.imdb.com/title/tt0286716/', 'http://localhost/uploads/movies/761730.jpg', 'https://www.youtube.com/watch?v=2ErnLuJKQA4', 2003),
(786599, 'IronMan', 'After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.', 'https://www.imdb.com/title/tt0371746/', 'http://localhost/uploads/movies/786599.jpg', 'https://www.youtube.com/watch?v=8hYlB38asDY', 2008);

-- --------------------------------------------------------

--
-- Table structure for table `mplinks`
--

CREATE TABLE `mplinks` (
  `movie_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `tag` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mplinks`
--

INSERT INTO `mplinks` (`movie_id`, `person_id`, `tag`) VALUES
(786599, 735796, 'actor'),
(786599, 42031, 'director'),
(664882, 28391, 'actor');

-- --------------------------------------------------------

--
-- Table structure for table `mulinks`
--

CREATE TABLE `mulinks` (
  `movie_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(20) NOT NULL,
  `value` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mulinks`
--

INSERT INTO `mulinks` (`movie_id`, `user_id`, `action`, `value`) VALUES
(786599, 510967, 'like', '1'),
(786599, 510967, 'comment', 'Nice Movie'),
(786599, 378155, 'like', '1'),
(20391, 378155, 'like', '1'),
(664882, 162665, 'like', '1'),
(664882, 162665, 'comment', 'Awsome Movie');

-- --------------------------------------------------------

--
-- Table structure for table `perfomance`
--

CREATE TABLE `perfomance` (
  `uuid` int(11) NOT NULL,
  `theatre_id` int(11) DEFAULT NULL,
  `movie_id` int(11) NOT NULL,
  `starttime` varchar(20) NOT NULL,
  `duration` int(11) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `perfomance`
--

INSERT INTO `perfomance` (`uuid`, `theatre_id`, `movie_id`, `starttime`, `duration`, `price`) VALUES
(136024, 399197, 664882, '1622397600000', 150, 80);

-- --------------------------------------------------------

--
-- Table structure for table `persons`
--

CREATE TABLE `persons` (
  `uuid` int(11) NOT NULL,
  `birthplace` varchar(40) NOT NULL,
  `birthdate` varchar(30) NOT NULL,
  `name` varchar(20) NOT NULL,
  `tag` varchar(20) NOT NULL,
  `imgurl` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `persons`
--

INSERT INTO `persons` (`uuid`, `birthplace`, `birthdate`, `name`, `tag`, `imgurl`) VALUES
(28391, 'London, England', '1 June 1996', 'Tom Holland', 'actor', 'http://localhost/uploads/persons/28391.jpg'),
(42031, 'Queens, New York City, New York, USA', 'October 19 1966', 'Jon Favreau', 'director', 'http://localhost/uploads/persons/42031._V1_FMjpg_UY450_'),
(735796, 'New York City, U.S.', '4 April 1965', 'Robert Downey Jr.', 'actor', 'http://localhost/uploads/persons/735796.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `pulinks`
--

CREATE TABLE `pulinks` (
  `perfomance_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `seats` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pulinks`
--

INSERT INTO `pulinks` (`perfomance_id`, `user_id`, `seats`) VALUES
(136024, 162665, '1-2-3-4-5-6-7'),
(136024, 378155, '8-9');

-- --------------------------------------------------------

--
-- Table structure for table `soundtrack`
--

CREATE TABLE `soundtrack` (
  `movie_id` int(11) NOT NULL,
  `lyricsby` int(11) NOT NULL,
  `sungby` int(11) NOT NULL,
  `url` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `theatre`
--

CREATE TABLE `theatre` (
  `uuid` int(11) NOT NULL,
  `noseats` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `theatre`
--

INSERT INTO `theatre` (`uuid`, `noseats`, `name`) VALUES
(399197, 70, 'Ruby Trails'),
(988244, 50, 'Legends Cineplex');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `uuid` int(11) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `role` varchar(10) NOT NULL,
  `imgurl` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`uuid`, `email`, `password`, `name`, `role`, `imgurl`) VALUES
(162665, 'ruby@gmail.com', 'Pass1234', 'Ruby', 'user', 'http://localhost/uploads/profilepics/162665.png'),
(367975, 'hanabi@gmail.com', 'Pass1234', 'hanabi', 'user', 'http://localhost/uploads/profilepics/367975.png'),
(378155, 'hayabusa@gmail.com', 'Pass1234', 'Hayabusa', 'admin', 'http://localhost/uploads/profilepics/378155.jpg'),
(445856, 'hanzo@gmail.com', 'Pass1234', 'Hanzo', 'user', 'http://localhost/uploads/profilepics/445856.png'),
(510967, 'kagura@gmail.com', 'Pass1234', 'Kagura', 'user', 'http://localhost/uploads/profilepics/510967.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `generes`
--
ALTER TABLE `generes`
  ADD KEY `movie_id` (`movie_id`);

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`uuid`);

--
-- Indexes for table `mplinks`
--
ALTER TABLE `mplinks`
  ADD KEY `movie_id` (`movie_id`),
  ADD KEY `person_id` (`person_id`);

--
-- Indexes for table `mulinks`
--
ALTER TABLE `mulinks`
  ADD KEY `movie_id` (`movie_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `perfomance`
--
ALTER TABLE `perfomance`
  ADD PRIMARY KEY (`uuid`),
  ADD KEY `movie_id` (`movie_id`),
  ADD KEY `theatre_id` (`theatre_id`);

--
-- Indexes for table `persons`
--
ALTER TABLE `persons`
  ADD PRIMARY KEY (`uuid`);

--
-- Indexes for table `pulinks`
--
ALTER TABLE `pulinks`
  ADD KEY `perfomance_id` (`perfomance_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `soundtrack`
--
ALTER TABLE `soundtrack`
  ADD PRIMARY KEY (`url`),
  ADD KEY `lyricsby` (`lyricsby`),
  ADD KEY `movie_id` (`movie_id`),
  ADD KEY `sungby` (`sungby`);

--
-- Indexes for table `theatre`
--
ALTER TABLE `theatre`
  ADD PRIMARY KEY (`uuid`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`uuid`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `generes`
--
ALTER TABLE `generes`
  ADD CONSTRAINT `generes_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`uuid`);

--
-- Constraints for table `mplinks`
--
ALTER TABLE `mplinks`
  ADD CONSTRAINT `mplinks_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`uuid`),
  ADD CONSTRAINT `mplinks_ibfk_2` FOREIGN KEY (`person_id`) REFERENCES `persons` (`uuid`);

--
-- Constraints for table `mulinks`
--
ALTER TABLE `mulinks`
  ADD CONSTRAINT `mulinks_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`uuid`),
  ADD CONSTRAINT `mulinks_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`uuid`);

--
-- Constraints for table `perfomance`
--
ALTER TABLE `perfomance`
  ADD CONSTRAINT `perfomance_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`uuid`),
  ADD CONSTRAINT `perfomance_ibfk_2` FOREIGN KEY (`theatre_id`) REFERENCES `theatre` (`uuid`);

--
-- Constraints for table `pulinks`
--
ALTER TABLE `pulinks`
  ADD CONSTRAINT `pulinks_ibfk_1` FOREIGN KEY (`perfomance_id`) REFERENCES `perfomance` (`uuid`),
  ADD CONSTRAINT `pulinks_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`uuid`);

--
-- Constraints for table `soundtrack`
--
ALTER TABLE `soundtrack`
  ADD CONSTRAINT `soundtrack_ibfk_1` FOREIGN KEY (`lyricsby`) REFERENCES `persons` (`uuid`),
  ADD CONSTRAINT `soundtrack_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`uuid`),
  ADD CONSTRAINT `soundtrack_ibfk_3` FOREIGN KEY (`sungby`) REFERENCES `persons` (`uuid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
