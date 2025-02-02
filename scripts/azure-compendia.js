class Azurecompendia {

    /**
     * The id of the package in the manifest
     */
    static ID = 'fu-azure-compendia';

    /**
     * A small helper function which leverages developer mode flags to gate debug logs.
     * 
     * @param {boolean} force - forces the log even if the debug flag is not on
     * @param  {...any} args - what to log
    */
    static logIf(force, ...args) {
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);

        if (shouldLog) {
            console.log(this.ID, '|', ...args);
        }
    }

    /**
     * A small helper function which leverages developer mode flags to gate debug logs.
     * 
     * @param  {...any} args - what to log
    */
    static log(...args) {
        this.logIf(true, args)
    }

    /**
     * Behaves like C# string format
     * @param {*} s 
     * @param  {...any} args 
     * @returns 
     */
    static fmt(s, ...args) {
        for (var arg in args) {
            s = s.replace("{" + arg + "}", args[arg]);
        }
        return s;
    }; 
}

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(ToDoList.ID);
});

Azurecompendia.log('Hello World!');