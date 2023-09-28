import Gio from 'gi://Gio';

/**
 * 
 * @param {*} settings 
 * @param {*} str 
 */
export function brightnessLog(settings, str) {
    if (settings.get_boolean('verbose-debugging'))
        console.log(`display-brightness-ddcutil extension:\n${str}`);
}

export function spawnWithCallback(settings, argv, callback) {
    const proc = Gio.Subprocess.new(argv, Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_SILENCE);

    proc.communicate_utf8_async(null, null, (proc, res) => {
        try {
            const [, stdout, stderr] = proc.communicate_utf8_finish(res);
            if (proc.get_successful()) {
                callback(stdout);
            } else {
                /*
                    errors from ddcutil (like monitor not found) were actually in stdout
                    only the process return code was 1
                */
                if (stderr)
                    callback(stderr);
                else if (stdout)
                    callback(stdout);
            }
        } catch (e) {
            brightnessLog(settings, e.message);
        }
    });
}

