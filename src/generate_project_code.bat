@echo off
:: Создаем временный файл для хранения результатов
set tempFile=%temp%\project_code.txt

:: Удаляем временный файл, если он уже существует
if exist "%tempFile%" del "%tempFile%"

:: Собираем структуру проекта
echo ===== Project Structure ===== > "%tempFile%"
for /f "delims=" %%d in ('dir /ad /b /s ^| findstr /i /v "\\node_modules\\"') do (
    echo %%d >> "%tempFile%"
)

:: Добавляем разделитель
echo. >> "%tempFile%"
echo ===== Code Files Content ===== >> "%tempFile%"
echo. >> "%tempFile%"

:: Собираем содержимое файлов с нужными расширениями, исключая node_modules
for /r %%f in (*.ts *.tsx *.html *.css) do (
    echo %%f | findstr /i /v "\\node_modules\\" >nul && (
        echo --- File: %%~f --- >> "%tempFile%"
        type "%%~f" >> "%tempFile%"
        echo. >> "%tempFile%"
    )
)

:: Копируем содержимое временного файла в буфер
type "%tempFile%" | clip

:: Удаляем временный файл
del "%tempFile%"

:: Сообщаем об успешном завершении
echo Project code and structure have been copied to clipboard.
pause
