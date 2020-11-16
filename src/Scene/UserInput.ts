export class UserInput{

    private keysPressed = new Set<string>();
    private keysPressedOnce = new Set<string>();
    private keysCooldown = new Set<string>();
    public sensitivity = 10.0;
    public mouseDelta: Array<number> = [0, 0];

    onPress(key: string): boolean {
        if (this.keysPressedOnce.has(key)) {
            this.keysPressedOnce.delete(key);
            this.keysCooldown.add(key);
            return true;
        }
        else {
            return false;
        }

    }

    isPressed(key: string): boolean {
        return this.keysPressed.has(key);
    }

    constructor(){
        document.addEventListener('keydown', event => {
            this.keysPressed.add(event.code);
            if (!this.keysCooldown.has(event.code)){
                this.keysPressedOnce.add(event.code);
            }

        });
        document.addEventListener('keyup', event => {
            this.keysPressed.delete(event.code);
            this.keysCooldown.delete(event.code);
        });
        document.addEventListener('mousemove', event => {
            const canvas =  document.querySelector('canvas');
            if (canvas){
                if (document.pointerLockElement === canvas) {
                    this.mouseDelta[0] = event.movementX;
                    this.mouseDelta[1] = event.movementY;
              } else {
                    this.mouseDelta[0] = 0;
                    this.mouseDelta[1] = 0;
              }
            }

        });
        document.addEventListener('click', event => {
            const canvas =  document.querySelector('canvas');
            if (canvas) {
                canvas.requestPointerLock();
            }
        });
    }
}
