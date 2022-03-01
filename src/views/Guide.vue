<template>
    <div class="container">
        <div class="card" style="margin-top: 8vh">
            <div class="card-header">Movement</div>
            <div class="card-body">
                <p>You can move with "wasd" or with the arrow keys</p>
            </div>
        </div>
        <div class="card mt-1">
            <div class="card-header">Abilities</div>
            <div class="card-body">
                <p>With the key "1" you can speed up your movement if you unlock the ability in your skilltree</p>
                <p>With the key "2" you can slow down your movement if you unlock the ability in your skilltree</p>
                <p>With the key "3" you can remote ignition the nearest bomb if you unlock the ability in your skilltree</p>
                <p>With the key "4" you can shoot at enemies (a hit gives you score) if you unlock the ability in your skilltree</p>
            </div>
        </div>

        <div class="card mt-1">
            <div class="card-header">Items</div>
            <div class="card-body">
                <div>
                    <img src="/gt/img/items/coin/coin.gif" alt="" />
                    A coin gives you score if you collect it
                </div>
                <div>
                    <img src="/gt/img/items/darkhole/darkhole.png" alt="" />
                    A darkhole sucks in everything nearby
                </div>
                <div>
                    <img src="/gt/img/items/potion/potion.gif" alt="" />
                    A growpotion makes you and enemies bigger if you are grown you get more score
                </div>
                <div>
                    <img src="/gt/img/items/bomb/bomb.gif" alt="" />
                    A bomb resets all enemies
                </div>
                <div>
                    <img src="/gt/img/items/magnet/magnet.png" alt="" />
                    A magnet lets you attract items and repel enemies or enemies attract you
                </div>
                <div>
                    <img src="/gt/img/items/snowflake/snowflake.png" alt="" />
                    Slow all enemies
                </div>
                <div>
                    <img src="/gt/img/items/clock/clock.png" alt="" />
                    Stops the time
                </div>
            </div>
        </div>
        <div class="card mt-1">
            <div class="card-header">Enemies</div>
            <div class="card-body">
                <div class="row justify-content-center">
                    <div style="height: 2vw; width: 2vw">
                        <img src="/gt/img/char/enemy_pingu.png" alt="" />
                    </div>
                    <div style="height: 2vw; width: 2vw">
                        <img src="/gt/img/char/enemy_cupcake.gif" alt="" />
                    </div>
                    <div style="height: 2vw; width: 2vw">
                        <img src="/gt/img/char/enemy_gasman.gif" alt="" />
                    </div>
                    <div style="height: 2vw; width: 2vw">
                        <img src="/gt/img/char/enemy_komet.gif" alt="" />
                    </div>
                </div>
                <p class="mt-1">They will kill you. wink smiley</p>
            </div>
        </div>
    </div>
</template>
