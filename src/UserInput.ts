export class UserInput{

    public keysPressed = new Set<string>();

    constructor(){
        document.addEventListener('keydown', event => {
            this.keysPressed.add(event.code);
        });
        document.addEventListener('keyup', event => {
            this.keysPressed.delete(event.code);
        });
    }
}
