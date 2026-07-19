@echo off
echo ========================================
echo  Spotify 2.0 - Real Songs Downloader
echo  Using yt-dlp (m4a - no ffmpeg needed)
echo ========================================
echo.

:: Create songs directory
if not exist "songs" mkdir songs

:: Remove old files
echo Cleaning up old files...
del /q "songs\track*.mp3" 2>nul
del /q "songs\track*.m4a" 2>nul
del /q "songs\track*.webm" 2>nul

echo.
echo Downloading 40 real songs in m4a format...
echo This may take 10-20 minutes.
echo.

:: Download format 140 = m4a 128kbps (no ffmpeg needed)
:: -f 140 is the m4a audio format available on most YouTube videos

echo [1/40] Kesariya - Arijit Singh
yt-dlp "ytsearch1:Kesariya Arijit Singh Brahmastra" -f 140 -o "songs/track01.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track01.m4a" (echo    OK) else (echo    FAILED)

echo [2/40] Tum Hi Ho - Arijit Singh
yt-dlp "ytsearch1:Tum Hi Ho Arijit Singh Aashiqui 2" -f 140 -o "songs/track02.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track02.m4a" (echo    OK) else (echo    FAILED)

echo [3/40] Raataan Lambiyan - Jubin Nautiyal
yt-dlp "ytsearch1:Raataan Lambiyan Jubin Nautiyal Asees Kaur" -f 140 -o "songs/track03.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track03.m4a" (echo    OK) else (echo    FAILED)

echo [4/40] Tera Ban Jaunga - Akhil Sachdeva
yt-dlp "ytsearch1:Tera Ban Jaunga Akhil Sachdeva Tulsi Kumar" -f 140 -o "songs/track04.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track04.m4a" (echo    OK) else (echo    FAILED)

echo [5/40] Apna Bana Le - Arijit Singh
yt-dlp "ytsearch1:Apna Bana Le Arijit Singh Bhediya" -f 140 -o "songs/track05.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track05.m4a" (echo    OK) else (echo    FAILED)

echo [6/40] Chaleya - Arijit Singh
yt-dlp "ytsearch1:Chaleya Arijit Singh Shilpa Rao Jawan" -f 140 -o "songs/track06.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track06.m4a" (echo    OK) else (echo    FAILED)

echo [7/40] Ik Vaari Aa - Arijit Singh
yt-dlp "ytsearch1:Ik Vaari Aa Arijit Singh Raabta" -f 140 -o "songs/track07.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track07.m4a" (echo    OK) else (echo    FAILED)

echo [8/40] Hawayein - Arijit Singh
yt-dlp "ytsearch1:Hawayein Arijit Singh Jab Harry Met Sejal" -f 140 -o "songs/track08.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track08.m4a" (echo    OK) else (echo    FAILED)

echo [9/40] Dil Diyan Gallan - Atif Aslam
yt-dlp "ytsearch1:Dil Diyan Gallan Atif Aslam Tiger Zinda Hai" -f 140 -o "songs/track09.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track09.m4a" (echo    OK) else (echo    FAILED)

echo [10/40] Tere Bina - Atif Aslam
yt-dlp "ytsearch1:Tere Bina Atif Aslam" -f 140 -o "songs/track10.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track10.m4a" (echo    OK) else (echo    FAILED)

echo [11/40] Excuses - AP Dhillon
yt-dlp "ytsearch1:Excuses AP Dhillon Gurinder Gill" -f 140 -o "songs/track11.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track11.m4a" (echo    OK) else (echo    FAILED)

echo [12/40] Brown Munde - AP Dhillon
yt-dlp "ytsearch1:Brown Munde AP Dhillon Gurinder Gill Shinda Kahlon" -f 140 -o "songs/track12.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track12.m4a" (echo    OK) else (echo    FAILED)

echo [13/40] Lover - Diljit Dosanjh
yt-dlp "ytsearch1:Lover Diljit Dosanjh" -f 140 -o "songs/track13.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track13.m4a" (echo    OK) else (echo    FAILED)

echo [14/40] GOAT - Diljit Dosanjh
yt-dlp "ytsearch1:GOAT Diljit Dosanjh G.O.A.T album" -f 140 -o "songs/track14.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track14.m4a" (echo    OK) else (echo    FAILED)

echo [15/40] Softly - Karan Aujla
yt-dlp "ytsearch1:Softly Karan Aujla" -f 140 -o "songs/track15.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track15.m4a" (echo    OK) else (echo    FAILED)

echo [16/40] Taare Ginn - Karan Aujla
yt-dlp "ytsearch1:Taare Ginn Karan Aujla Making Memories" -f 140 -o "songs/track16.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track16.m4a" (echo    OK) else (echo    FAILED)

echo [17/40] Pasoori - Ali Sethi
yt-dlp "ytsearch1:Pasoori Ali Sethi Shae Gill Coke Studio" -f 140 -o "songs/track17.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track17.m4a" (echo    OK) else (echo    FAILED)

echo [18/40] Naina - Arijit Singh
yt-dlp "ytsearch1:Naina Arijit Singh Dangal" -f 140 -o "songs/track18.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track18.m4a" (echo    OK) else (echo    FAILED)

echo [19/40] Aaoge Tum Kabhi - Stebin Ben
yt-dlp "ytsearch1:Aaoge Tum Kabhi Stebin Ben" -f 140 -o "songs/track19.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track19.m4a" (echo    OK) else (echo    FAILED)

echo [20/40] Teri Baaton Mein - Stebin Ben
yt-dlp "ytsearch1:Teri Baaton Mein Esa Uljha Jiya Stebin Ben" -f 140 -o "songs/track20.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track20.m4a" (echo    OK) else (echo    FAILED)

echo [21/40] Kho Gaye Hum Kahan - Jasleen Royal
yt-dlp "ytsearch1:Kho Gaye Hum Kahan Jasleen Royal Prateek Kuhad" -f 140 -o "songs/track21.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track21.m4a" (echo    OK) else (echo    FAILED)

echo [22/40] Doobey - Lothika
yt-dlp "ytsearch1:Doobey Lothika Gehraiyaan" -f 140 -o "songs/track22.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track22.m4a" (echo    OK) else (echo    FAILED)

echo [23/40] Ranjha - B Praak
yt-dlp "ytsearch1:Ranjha B Praak Shershaah" -f 140 -o "songs/track23.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track23.m4a" (echo    OK) else (echo    FAILED)

echo [24/40] Besharam Rang - Vishal Shekhar
yt-dlp "ytsearch1:Besharam Rang Pathaan" -f 140 -o "songs/track24.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track24.m4a" (echo    OK) else (echo    FAILED)

echo [25/40] Naatu Naatu - Rahul Sipligunj
yt-dlp "ytsearch1:Naatu Naatu RRR Telugu" -f 140 -o "songs/track25.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track25.m4a" (echo    OK) else (echo    FAILED)

echo [26/40] Jhoome Jo Pathaan - Arijit Singh
yt-dlp "ytsearch1:Jhoome Jo Pathaan Arijit Singh" -f 140 -o "songs/track26.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track26.m4a" (echo    OK) else (echo    FAILED)

echo [27/40] Zinda Banda - Vishal Dadlani
yt-dlp "ytsearch1:Zinda Banda Jawan Vishal Dadlani" -f 140 -o "songs/track27.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track27.m4a" (echo    OK) else (echo    FAILED)

echo [28/40] Srivalli - Sid Sriram
yt-dlp "ytsearch1:Srivalli Sid Sriram Pushpa" -f 140 -o "songs/track28.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track28.m4a" (echo    OK) else (echo    FAILED)

echo [29/40] Jai Ho - AR Rahman
yt-dlp "ytsearch1:Jai Ho AR Rahman Slumdog Millionaire" -f 140 -o "songs/track29.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track29.m4a" (echo    OK) else (echo    FAILED)

echo [30/40] Maa - Shankar Mahadevan
yt-dlp "ytsearch1:Maa Shankar Mahadevan Taare Zameen Par" -f 140 -o "songs/track30.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track30.m4a" (echo    OK) else (echo    FAILED)

echo [31/40] Chaiyya Chaiyya - Sukhwinder Singh
yt-dlp "ytsearch1:Chaiyya Chaiyya Sukhwinder Singh Dil Se" -f 140 -o "songs/track31.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track31.m4a" (echo    OK) else (echo    FAILED)

echo [32/40] Kuch Kuch Hota Hai - Udit Narayan
yt-dlp "ytsearch1:Kuch Kuch Hota Hai title song Udit Narayan" -f 140 -o "songs/track32.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track32.m4a" (echo    OK) else (echo    FAILED)

echo [33/40] Tujhe Dekha Toh - Kumar Sanu
yt-dlp "ytsearch1:Tujhe Dekha Toh Kumar Sanu Dilwale Dulhania" -f 140 -o "songs/track33.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track33.m4a" (echo    OK) else (echo    FAILED)

echo [34/40] Kal Ho Naa Ho - Sonu Nigam
yt-dlp "ytsearch1:Kal Ho Na Ho Sonu Nigam title track" -f 140 -o "songs/track34.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track34.m4a" (echo    OK) else (echo    FAILED)

echo [35/40] Kannazhaga - AR Rahman
yt-dlp "ytsearch1:Kannazhaga AR Rahman 3 Moonu" -f 140 -o "songs/track35.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track35.m4a" (echo    OK) else (echo    FAILED)

echo [36/40] Rowdy Baby - Dhanush
yt-dlp "ytsearch1:Rowdy Baby Dhanush Sai Pallavi Maari 2" -f 140 -o "songs/track36.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track36.m4a" (echo    OK) else (echo    FAILED)

echo [37/40] Buttabomma - Armaan Malik
yt-dlp "ytsearch1:Buttabomma Armaan Malik Ala Vaikunthapurramuloo Telugu" -f 140 -o "songs/track37.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track37.m4a" (echo    OK) else (echo    FAILED)

echo [38/40] Saami Saami - Mounika Yadav
yt-dlp "ytsearch1:Saami Saami Mounika Yadav Pushpa Telugu" -f 140 -o "songs/track38.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track38.m4a" (echo    OK) else (echo    FAILED)

echo [39/40] Tere Jaisa Yaar Kahan - Kishore Kumar
yt-dlp "ytsearch1:Yaar Mila Hai Kishore Kumar Yaarana 1981" -f 140 -o "songs/track39.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track39.m4a" (echo    OK) else (echo    FAILED)

echo [40/40] Lag Ja Gale - Lata Mangeshkar
yt-dlp "ytsearch1:Lag Ja Gale Lata Mangeshkar Woh Kaun Thi" -f 140 -o "songs/track40.m4a" --no-playlist --quiet --no-warnings 2>nul
if exist "songs/track40.m4a" (echo    OK) else (echo    FAILED)

echo.
echo ========================================
echo  Download complete! Counting files...
echo ========================================
set count=0
for %%f in (songs\track*.m4a) do set /a count+=1
echo  Files downloaded: %count%/40
echo ========================================
