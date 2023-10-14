# Locksmith

You can make keys here.

It takes 30 seconds to make a key, you must stay in the safe zone the entire time.

If you leave, you'll need to start the 'Make a key' process again..

<Cooldown id="locksmith">
    <Take id="_made-gun-key" cooldown="locksmith" time={30}>Make a Gun Key</Take>
    <Take id="_made-hw-key" cooldown="locksmith" time={30}>Make a Hardware Key</Take>
    <Take id="_made-gas-key" cooldown="locksmith" time={30}>Make a Gas Key</Take>
    <Need id="_made-gun-key"><Take id="gun-key">I stayed in the locksmith, take the Gun Key</Take></Need>
    <Need id="_made-hw-key"><Take id="hw-key">I stayed in the locksmith, take the Hardware Key</Take></Need>
    <Need id="_made-gas-key"><Take id="gas-key">I stayed in the locksmith, take the Gas Key</Take></Need>
</Cooldown>
