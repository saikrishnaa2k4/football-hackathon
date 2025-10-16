$(document).ready(function() {
    // --- GET ELEMENTS ---
    // Get references to the ball and goalkeepers from the HTML
    const ball = $("#footBall");
    const goalKeeper1 = $("#goalKeeper1");
    const goalKeeper2 = $("#goalKeeper2");

    // --- INITIAL STATE ---
    // Define the ball's starting position and size
    const initialBallState = {
        top: '400px',
        left: '295px', // Horizontally centered in a 640px container
        height: '50px',
        width: '50px'
    };

    // --- GAME VARIABLES ---
    let isKicking = false;      // Prevents kicking while the ball is already moving
    let kickInterval = null;    // Holds the animation timer

    // --- CORE FUNCTIONS ---

    /**
     * Resets the ball to its starting position and stops any animation.
     */
    function resetBall() {
        if (kickInterval) {
            clearInterval(kickInterval); // Stop the animation interval
        }
        isKicking = false;
        ball.stop().css(initialBallState); // .stop() clears any pending animations
    }

    /**
     * Checks if the ball is touching either of the goalkeepers.
     * Returns true for a collision, false otherwise.
     */
    function checkCollision() {
        const ballRect = ball[0].getBoundingClientRect();
        const gk1Rect = goalKeeper1[0].getBoundingClientRect();
        const gk2Rect = goalKeeper2[0].getBoundingClientRect();

        // Check for overlap with goalkeeper 1
        const collidesWithGk1 = !(ballRect.right < gk1Rect.left || ballRect.left > gk1Rect.right || ballRect.bottom < gk1Rect.top || ballRect.top > gk1Rect.bottom);
        // Check for overlap with goalkeeper 2
        const collidesWithGk2 = !(ballRect.right < gk2Rect.left || ballRect.left > gk2Rect.right || ballRect.bottom < gk2Rect.top || ballRect.top > gk2Rect.bottom);

        return collidesWithGk1 || collidesWithGk2;
    }

    /**
     * Kicks the ball straight towards the goal.
     */
    function kickStraight() {
        if (isKicking) {
            return; // Exit if the ball is already moving
        }
        isKicking = true;

        let currentTop = ball.position().top;
        let currentSize = ball.height();

        // Start an interval to move the ball frame by frame
        kickInterval = setInterval(function() {
            // Move the ball up by 10 pixels
            currentTop -= 10;
            // Shrink the ball slightly to give a 3D perspective effect
            currentSize *= 0.99;

            ball.css({
                'top': currentTop + 'px',
                'height': currentSize + 'px',
                'width': currentSize + 'px'
            });

            // STOP CONDITION 1: Ball hits a goalkeeper
            if (checkCollision()) {
                clearInterval(kickInterval); // Stop the ball's movement
                return;
            }

            // STOP CONDITION 2: Ball reaches the goal
            if (currentTop < 150) {
                clearInterval(kickInterval);
                alert("GOAL!");
                setTimeout(resetBall, 500); // Reset the game after 0.5 seconds
            }
        }, 25); // This number controls the speed of the animation (lower is faster)
    }

    /**
     * Moves the goalkeepers from side to side continuously.
     */
    function moveGoalkeepers() {
        // Goalkeeper 1 Movement
        let pos1 = 310; let dir1 = 1;
        setInterval(() => {
            if (pos1 > 450) dir1 = -1;
            if (pos1 < 100) dir1 = 1;
            pos1 += 10 * dir1;
            goalKeeper1.css('left', pos1);
        }, 40);

        // Goalkeeper 2 Movement
        let pos2 = 110; let dir2 = -1;
        setInterval(() => {
            if (pos2 > 440) dir2 = -1;
            if (pos2 < 110) dir2 = 1;
            pos2 += 10 * dir2;
            goalKeeper2.css('left', pos2);
        }, 50);
    }

    // --- EVENT LISTENERS ---

    // 1. Listen for any key press on the page
    $(document).on('keydown', function(event) {
        // If the pressed key is 'Enter', kick the ball
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevents the browser's default 'Enter' action
            kickStraight();
        }
    });

    // 2. Listen for a double-click anywhere on the page
    $(document).on('dblclick', function() {
        resetBall();
    });


    // --- INITIALIZE GAME ---
    // This function runs once when the page is loaded
    function initialize() {
        resetBall();          // Place the ball at the starting position
        moveGoalkeepers();    // Start the goalkeepers' movement
    }

    initialize();
});





