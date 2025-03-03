## Description

This project is a League of Legends Fearless Draft Simulator. It allows users to simulate the "Fearless Draft" mode, where champions picked by one team are banned for the other team in subsequent picks.

Here are some visual previews:

![main](https://raw.githubusercontent.com/Brian-LEE0/lol-fearless-draft-simulator/refs/heads/main/main.png)
![waiting-room](https://raw.githubusercontent.com/Brian-LEE0/lol-fearless-draft-simulator/refs/heads/main/waiting-room.png)

## Getting Started

docker build -t lol-draft-simulator:latest .
docker run -d -p 3000:3000 -p 2984:2984 --restart=always --name lol-draft-simulator lol-draft-simulator:latest