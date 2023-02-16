# Rock-Paper-Scissors-Lizard-Spock
Web3 page interacting with a RPS smart contract

Deployed on Goerli network with Vercel, please visit this link:
https://rock-paper-scissors-lizard-spock-dta480yw9-jeremypoinas.vercel.app/

# How to play
Player 1
1/ Enter the ETH address of the player you want to challenge, the move you want to play, and the amount to bet that will be staked
2/ Commit your move
3/ You get redirected to a new page for your newly created game
WARNING! 
- YOU WILL NEED TO COPY THE URL AND SEND IT TO PLAYER 2 SO HE CAN PLAY WITH YOU
- YOU WILL NEED TO REMEMBER THE SALT AND YOUR MOVE. WE KEEP THE SALT IN STATE ONLY IF YOU STAY ON THE PAGE
4/ Here you can decide to declare a timeout for player 2 if he doesn't play after 2mn has passed since the creation of the game
5/ Once player 2 has played, you can solve the game by revealing the move you played and the salt (only written if you stayed in the page)
6/ Funds are sent to the winner

Player 2
1/ Player 1 must send you the URL of the game since it is a newly deployed smart contract
2/ Select the move you want to play (be sure to check the amount bet by player 1 as you will have to stake this amount)
3/ Wait for player 1 to solve the game. If he doesn't do it after 2mn, you can declare a timeout for player 1 and take the whole stake
4/ Once player 1 has solved the game, funds are sent to the winner

HAVE FUN!
