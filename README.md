
<h1 align="center">✨ Tic-Tac-Toe | Never a Tie ✨</h1>

## Overview

This Tic-Tac-Toe game, built with React.js, offers an engaging twist on the classic board game. Players alternate turns as "X" or "O" on a 3x3 grid, with each player limited to three symbols on the board at a time, causing the oldest move to be removed upon a fourth move. The game features real-time feedback for invalid moves, customizable player names, and interactive instructions accessed by pressing 'H'. The first player to align three of their symbols wins, with victory conditions and moves highlighted through dynamic animations. The app integrates SweetAlert2 for user-friendly alerts and EmailJS for additional notifications, providing an enjoyable and interactive gaming experience.

### UI 
![image](./src/assets/Cross.svg) 

## Setup Steps

- Clone the Repository

```
git clone https://github.com/DileepGhanta/Tic-Tac-Toe.git
```
- Change directory

```
cd Tic-Tac-Toe
```
- Install node_modules 
```
npm install
```
- Install Dependencies 
```
npm install @emailjs/browser emailjs-com mdb-react-ui-kit react react-dom sweetalert2 sweetalert
```

- To set up EmailJS, follow the instructions provided [here](https://dev.to/david_bilsonn/how-to-send-emails-directly-from-your-react-website-a-step-by-step-tutorial-144b).

- Start LocalHost Server
```
npm run dev
```