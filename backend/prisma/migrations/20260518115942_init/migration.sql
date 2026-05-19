-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProfilePreference` (
    `userId` INTEGER NOT NULL,
    `styleTags` JSON NOT NULL,
    `colorPreferences` JSON NOT NULL,
    `musicPreferences` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyCheckIn` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `checkinDate` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `moodDetected` VARCHAR(191) NOT NULL,
    `moodSelected` VARCHAR(191) NOT NULL,
    `answers` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `DailyCheckIn_userId_checkinDate_key`(`userId`, `checkinDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recommendation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `checkinId` INTEGER NOT NULL,
    `recommendationDate` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `outfits` JSON NOT NULL,
    `makeup` JSON NOT NULL,
    `music` JSON NOT NULL,
    `feedbackPositive` BOOLEAN NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Streak` (
    `userId` INTEGER NOT NULL,
    `currentStreak` INTEGER NOT NULL DEFAULT 0,
    `maxStreak` INTEGER NOT NULL DEFAULT 0,
    `lastCheckinDate` DATE NULL,
    `weeklyFreezeUsedDate` DATE NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Badge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `criteria` JSON NOT NULL,

    UNIQUE INDEX `Badge_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserBadge` (
    `userId` INTEGER NOT NULL,
    `badgeId` INTEGER NOT NULL,
    `progress` INTEGER NOT NULL DEFAULT 0,
    `unlockedAt` DATETIME(3) NULL,

    PRIMARY KEY (`userId`, `badgeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProfilePreference` ADD CONSTRAINT `ProfilePreference_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyCheckIn` ADD CONSTRAINT `DailyCheckIn_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recommendation` ADD CONSTRAINT `Recommendation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recommendation` ADD CONSTRAINT `Recommendation_checkinId_fkey` FOREIGN KEY (`checkinId`) REFERENCES `DailyCheckIn`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Streak` ADD CONSTRAINT `Streak_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserBadge` ADD CONSTRAINT `UserBadge_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserBadge` ADD CONSTRAINT `UserBadge_badgeId_fkey` FOREIGN KEY (`badgeId`) REFERENCES `Badge`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
