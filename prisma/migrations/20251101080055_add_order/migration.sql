-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `shippingAddress` TEXT NOT NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,
    `paymentResult` VARCHAR(191) NOT NULL,
    `paidAt` DATETIME(3) NOT NULL,
    `itemsPrice` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `shippingPrice` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `taxPrice` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `totalPrice` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `isDelivered` BOOLEAN NOT NULL DEFAULT false,
    `deliveredAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_item` (
    `productId` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,
    `qty` INTEGER NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL DEFAULT 0,

    PRIMARY KEY (`orderId`, `productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_item` ADD CONSTRAINT `order_item_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_item` ADD CONSTRAINT `order_item_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
