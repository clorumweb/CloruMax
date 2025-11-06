const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'messenger.db');
const db = new sqlite3.Database(dbPath);

// Добавляем недостающие колонки
db.serialize(() => {
    db.run("ALTER TABLE users ADD COLUMN display_name TEXT");
    db.run("ALTER TABLE users ADD COLUMN avatar_url TEXT DEFAULT 'default'");
    console.log('✅ База данных обновлена!');
    
    // Обновляем существующих пользователей
    db.run("UPDATE users SET display_name = username WHERE display_name IS NULL");
    
    // Пересоздаем админов с новыми паролями
    const createAdmin = (username, password) => {
        const hashedPassword = 'hashed_' + password;
        db.run(
            `INSERT OR REPLACE INTO users (username, display_name, password, is_admin) 
             VALUES (?, ?, ?, TRUE)`,
            [username, username, hashedPassword]
        );
    };
    
    createAdmin('Lenkov', 'ClorumAdminNord');
    createAdmin('9nge', 'ClorumPrCreator9nge');
    
    db.close();
});