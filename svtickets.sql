-- phpMyAdmin SQL Dump
-- version 4.6.6deb4+deb9u2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 11-10-2021 a las 23:19:47
-- Versión del servidor: 10.1.48-MariaDB-0+deb9u2
-- Versión de PHP: 7.0.33-0+deb9u11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `svtickets`
--
CREATE DATABASE IF NOT EXISTS `svtickets` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `svtickets`;

DELIMITER $$
--
-- Funciones
--
CREATE DEFINER=`root`@`localhost` FUNCTION `haversine` (`lat1` FLOAT, `lon1` FLOAT, `lat2` FLOAT, `lon2` FLOAT) RETURNS FLOAT NO SQL
    DETERMINISTIC
    COMMENT 'Returns the distance in degrees on the Earth\r\n             between two known points of latitude and longitude'
BEGIN
    RETURN DEGREES(
        	ACOS(
              COS(RADIANS(lat1)) *
              COS(RADIANS(lat2)) *
              COS(RADIANS(lon2) - RADIANS(lon1)) +
              SIN(RADIANS(lat1)) * SIN(RADIANS(lat2))
            )
    	  )*111.045;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `event`
--

CREATE TABLE `event` (
  `id` int(10) UNSIGNED NOT NULL,
  `creator` int(10) UNSIGNED NOT NULL,
  `title` varchar(300) NOT NULL,
  `description` varchar(4000) NOT NULL,
  `date` datetime NOT NULL,
  `price` int(11) NOT NULL,
  `lat` double(9,6) NOT NULL,
  `lng` double(9,6) NOT NULL,
  `address` varchar(400) NOT NULL,
  `image` varchar(200) NOT NULL,
  `numAttend` int(10) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `avatar` varchar(250) NOT NULL,
  `lat` double(9,6) NOT NULL,
  `lng` double(9,6) NOT NULL,
  `firebase_token` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_attend_event`
--

CREATE TABLE `user_attend_event` (
  `user` int(10) UNSIGNED NOT NULL,
  `event` int(10) UNSIGNED NOT NULL,
  `tickets` smallint(5) UNSIGNED NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Disparadores `user_attend_event`
--
DELIMITER $$
CREATE TRIGGER `update_attend_event` AFTER UPDATE ON `user_attend_event` FOR EACH ROW UPDATE event SET numAttend = numAttend - OLD.tickets + NEW.tickets WHERE id = OLD.event
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `user attends event` AFTER INSERT ON `user_attend_event` FOR EACH ROW UPDATE event SET numAttend = numAttend + NEW.tickets WHERE id = NEW.event
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `user not attend event` AFTER DELETE ON `user_attend_event` FOR EACH ROW UPDATE event SET numAttend = numAttend - OLD.tickets WHERE id = OLD.event
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_comment_event`
--

CREATE TABLE `user_comment_event` (
  `id` int(10) UNSIGNED NOT NULL,
  `event` int(10) UNSIGNED NOT NULL,
  `user` int(10) UNSIGNED NOT NULL,
  `comment` varchar(2000) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creator` (`creator`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `user_attend_event`
--
ALTER TABLE `user_attend_event`
  ADD PRIMARY KEY (`user`,`event`),
  ADD KEY `user_attend_event_ibfk_2` (`event`);

--
-- Indices de la tabla `user_comment_event`
--
ALTER TABLE `user_comment_event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event` (`event`,`user`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `event`
--
ALTER TABLE `event`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `user_comment_event`
--
ALTER TABLE `user_comment_event`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `event_ibfk_1` FOREIGN KEY (`creator`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `user_attend_event`
--
ALTER TABLE `user_attend_event`
  ADD CONSTRAINT `user_attend_event_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_attend_event_ibfk_2` FOREIGN KEY (`event`) REFERENCES `event` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `user_comment_event`
--
ALTER TABLE `user_comment_event`
  ADD CONSTRAINT `user_comment_event_ibfk_1` FOREIGN KEY (`event`,`user`) REFERENCES `user_attend_event` (`event`, `user`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
