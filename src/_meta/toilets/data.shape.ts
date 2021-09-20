

export default interface toiletData {
    located: {
        building: "A" | "B" | "D" | "E" | "G" | "I" | "J" | "H",
        room: "corridor" | "hall",
    },
    
    /**
     * Is the room that contains all stalls a corridor or a big open room ?
     */
    style: "corridor" | "open", 

    general: {
        /**
         * 
         * add later because it's so annoying  
        internet: {
            data: number,
            eduroam: number,K
        }
        */

        /**
         * The number of sinks
         */
        sinks: number, 
        /**
         * Instead of counting the mirrors,
         * defines their size, if present.
         */
        mirror?: "small" | "big",

        /**
         * Can literally all of china hear you shit ?
         */
        echoes: boolean,
    }

    /**
     * Specific description of the stalls
     */
    closets: {
        /**
         * Is it an open toilet ? (stalls instead of an actual room)
         */
        open: boolean, 
        
        /**
         * Does the ceiling of the general room touch the top
         * of the stalls' walls ?
         */
        closedCeiling: boolean,
        
        /**
         * Describes the size of the stall.
         * A good indicator is if you have to move 
         * to open/close the door,
         * it's probably cramped
         */
        size: "cramped" | "good" | "spacious",
        
        /**
         * Is the toilet not facing the door ?
         */
        angled: boolean,

        /**
         * Various details of the lock 
         */
        lock: {
            /**
             * Is it one of those weird lock where you rotate the whole thing
             * or a normal one where metal goes in the wall
             */
            type: 'rotating' | 'normal',
            
            /**
             * Is the actual lock hidden
             */
            hidden: boolean,

            /**
             * Is there anything that would make people on the other side
             * of the door understand it's locked ?
             */
            visualClue: boolean,
        }

        /**
         * Various details of the flushing part of things
         */
        flush: {
            /**
             * Does the noise of the water last wayyy too long after it has finished wooshing ?
             */
            overextends: boolean,

            /**
     indoor        * Describes how much noise the flushing makes, from a calm river to a literal hurricane
             */
            decibels: 'calm' | 'normal' | 'noisy' | 'hurricane';
        }


    },

    windows: false | {
        count: number,
        blurred: boolean,
    },

    specials: string[], //e.g. special view ? tiles ?
}