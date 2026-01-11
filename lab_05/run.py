import subprocess
import time
SESSION = "book_service"
WINDOW_NAME = "library"

panels = {
    "users": [
        "cd users && pipenv run python main.py"
    ],
    "books": [
        "cd book_mgmt && pipenv run python main.py"
    ],
    "orders": [
        "cd orders && pipenv run python main.py"
    ],
}

def run(cmd):
    subprocess.run(cmd, check=True)

try:
    result = subprocess.run(
        ["tmux", "has-session", "-t", SESSION],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    if result.returncode != 0:
        run(["tmux", "new-session", "-d", "-s", SESSION])


    #run(["tmux", "kill-window", "-t", f"{SESSION}:0"])

    run(["tmux", "new-window", "-t", SESSION, "-n", WINDOW_NAME])

    for pane_name, cmds in panels.items():

        run(["tmux", "split-window", "-t", f"{SESSION}:{WINDOW_NAME}"])
        for cmd in cmds:
            run([
                "tmux", "send-keys",
                "-t", f"{SESSION}:{WINDOW_NAME}",
                cmd, "C-m"
            ])

    run([
        "tmux", "select-layout",
        "-t", f"{SESSION}:{WINDOW_NAME}",
        "tiled"
    ])


    run(["tmux", "attach", "-t", SESSION])
except Exception:
    run(["tmux", "kill-window", "-t", f"{SESSION}:0"])
