# VLR VORTEX - Tournament Pickem Design Document

## Color Palette
- **Primary**: #FF4500 (Vibrant Orange - from the logo)
- **Secondary**: #FF6B35 (Warm Orange)
- **Accent**: #FFD700 (Gold for winners)
- **Background**: #0A0A0F (Deep Dark)
- **Surface**: #1A1A2E (Card backgrounds)
- **Surface Light**: #252542 (Hover states)
- **Text Primary**: #FFFFFF
- **Text Secondary**: #A0A0B8
- **Success**: #00FF88 (Correct pick - bright green)
- **Error**: #FF3366 (Wrong pick - bright red)
- **Glow Orange**: rgba(255, 69, 0, 0.4)

## Typography
- **Headings**: System font stack, bold/black weight, uppercase
- **Body**: System font, regular weight
- **Seeds/Numbers**: Monospace for alignment

## Bracket Layout
14 teams, single elimination, 2 byes (seed 1 & 2)

### Rounds
1. **First Round** (6 matches) - leftmost column
2. **Quarter-Finals** (4 matches) - includes bye teams
3. **Semi-Finals** (2 matches)
4. **Finals** (1 match)
5. **Champion** - center celebration

### Match Structure
```
FIRST ROUND           QUARTER-FINALS        SEMI-FINALS       FINALS

#9 Wizards     ┐
#8 Moggers     ┘──┐
                   ├── #1 Pibble Army vs W ──┐
#5 Invincibles ┐   │                          │
#12 HTDRS      ┘──┘                          ├── Winner ──┐
#13 Avyukt     ┐                              │            │
#4 Frag        ┘──── Winner vs Winner ────────┘            │
                                                           ├── CHAMPION
#3 Gooner G    ┐                                           │
#14 Invinc 2   ┘──── Winner vs Winner ────────┐            │
#11 SNS        ┐                              │            │
#6 Khatti M    ┘──┐                           ├── Winner ──┘
                   ├── W vs #2 Tesseract ─────┘
#7 Vortex      ┐   │
#10 Slayers    ┘──┘
```

## Animations
- Page load: Bracket lines draw in sequentially (left to right)
- Match cards: Fade in with stagger (top to bottom per column)
- Team hover: Glow effect + slight scale
- Pick selection: Pulse + particle burst
- Correct pick: Green shimmer wave
- Wrong pick: Red shake + fade
- Counter: Number flip animation
- Background: Subtle floating particles

## Components
1. **Header** - Logo, title, user info, counter
2. **Bracket** - Full bracket container with SVG connector lines
3. **MatchCard** - Individual match with two team slots
4. **TeamSlot** - Clickable team with seed, name, logo placeholder
5. **RegisterModal** - Username input popup
6. **AdminPanel** - Protected route for result management
7. **PickemCounter** - Animated counter widget

## Pages
- `/` - Main bracket pickem page
- `/admin` - Admin login + result management

## API Routes
- `POST /api/register` - Register username
- `POST /api/picks` - Save user picks
- `GET /api/picks?username=x` - Get user picks
- `GET /api/stats` - Get pick count
- `POST /api/admin/login` - Admin auth
- `POST /api/admin/results` - Update match results
- `GET /api/admin/results` - Get current results

## MongoDB Schema

### User
```
{ username: String (unique), createdAt: Date }
```

### Pick
```
{ username: String, matchId: String, pickedTeam: String, createdAt: Date }
```

### MatchResult
```
{ matchId: String (unique), winner: String, updatedAt: Date }
```
