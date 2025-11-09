# Konfiguracja Cloudinary

## Krok 1: Pobierz dane z Cloudinary Dashboard

1. Zaloguj się do [Cloudinary Console](https://console.cloudinary.com/)
2. Na Dashboard znajdziesz:
   - **Cloud Name** - nazwa Twojego clouda
   - **API Key** (nie potrzebny dla uploadu z przeglądarki)
   - **API Secret** (nie używaj w kodzie frontend!)

## Krok 2: Utwórz Upload Preset

1. W Cloudinary Dashboard → **Settings** → **Upload**
2. Przewiń do sekcji **Upload presets**
3. Kliknij **Add upload preset**
4. Ustawienia:
   - **Preset name**: np. `listravel_trips`
   - **Signing Mode**: **Unsigned** (ważne!)
   - **Folder**: `listravel/trips` (opcjonalnie)
   - **Transformations**: możesz dodać automatyczne optymalizacje
5. Zapisz preset

## Krok 3: Dodaj dane do .env

Otwórz plik `.env` i dodaj:

```bash
VITE_CLOUDINARY_CLOUD_NAME=twoj_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=listravel_trips
```

## Krok 4: Struktura folderów w Cloudinary

Sugerowana struktura:

```
listravel/
  └── trips/
      ├── [nazwa-wycieczki]-[data].jpg
      └── thumbnails/ (opcjonalnie, ale możesz użyć transformacji URL)
```

## Bezpieczeństwo

✅ **Bezpieczne:**

- Cloud Name - publiczny
- Upload Preset (unsigned) - publiczny

❌ **NIE umieszczaj w kodzie:**

- API Secret

## Jak to działa

1. Użytkownik wybiera zdjęcie w formularzu
2. Zdjęcie jest uploadowane bezpośrednio do Cloudinary
3. Cloudinary zwraca URL zdjęcia
4. URL jest zapisywany w Firestore wraz z danymi wycieczki
5. Thumbnail jest generowany automatycznie przez transformację URL

## Przykład użycia

```typescript
import { uploadToCloudinary, getThumbnailUrl } from "./utils/cloudinary";

// Upload zdjęcia
const response = await uploadToCloudinary(file);
const imageUrl = response.secure_url;
const thumbnailUrl = getThumbnailUrl(imageUrl, 400);

// Zapisz URL do Firestore
await addTrip({
  title: "Wycieczka",
  imageUrl,
  thumbnailUrl,
  // ... inne dane
});
```
