@echo off
:: Создаем временный файл для хранения результатов
set tempFile=%temp%\project_code.txt

:: Удаляем временный файл, если он уже существует
if exist "%tempFile%" del "%tempFile%"

:: Собираем структуру проекта
setlocal enabledelayedexpansion
echo ===== Project Structure ===== > "%tempFile%"
for /f "delims=" %%d in ('dir /s /b /ad ^| findstr /i /v "\\node_modules\\"') do (
    echo Folder: %%d >> "%tempFile%"
    for /f "delims=" %%f in ('dir "%%d" /b /a-d ^| findstr /i /v "\\node_modules\\"') do (
        echo    File: %%f >> "%tempFile%"
    )
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
echo Project structure and code have been copied to clipboard.
pause