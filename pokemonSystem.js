(function() {
    var google = 'https://pokemondb.net/pokedex/',
        reGetUrl = new RegExp(/(\[Legendary\]\s)?(.*)\s=(.*)=.*/),
        reGetTitle = new RegExp(/(\[Legendary\]\s)?(.*)\s=(.*)=.*/),
        responses = {
            attack: 1,
            fight: 1,
            miss: 1
        },
        totalWaifus = 0,
        navigatorImg = 'navigator.png';

    load();

    /*
     * @function load
     * @info Loads everything needed for this script to work. Add functions that need loading at startup in here.
     */
    function load() {
        loadWaifus();
        loadResponses();
        pushWaifus();
    }

    /*
     * @function loadWaifus
     * @info Gets a count of all the waifus and stores it in a variable. It will also generate a txt file with all the waifus.
     */
    function loadWaifus() {
        var string = '',
            i = 1;

        while ($.lang.exists('pwaifugames.waifu.' + i)) {
            string += 'Pokemon #' + i + ' ' + replace($.lang.get('pwaifugames.waifu.' + i)) + '\r\n';
            ++i;

            //$.writeToFile('Waifu #' + i + ' ' + replace($.lang.get('pwaifugames.waifu.' + i)) + '\r\n', 'waifus.txt', false);
        }
        totalWaifus = i;
    }

        /*
         * @function pushWaifus
         * @info Pushes the entire waifu list to the db, it does disable auto commit first to make this process a lot faster.
         */
    function pushWaifus() {
        var i = 1;

        $.inidb.setAutoCommit(false);
        while ($.lang.exists('pwaifugames.waifu.' + i)) {
            if (!$.inidb.exists('pokemon', i)) { // This will make setting pokemons faster since it does not need to write prokemons that are already on the disk.
                $.inidb.set('pokemon', i, $.lang.get('pwaifugames.waifu.' + i));
            }
            ++i;
        }
        $.inidb.setAutoCommit(true);
    }

    /*
     * @function loadResponses
     * Gets a count of all of the game responses and saves them in an object to be used later.
     */
    function loadResponses() {
        while ($.lang.exists('pwaifugames.attack.' + responses.attack)) {
            ++responses.attack;
        }

        while ($.lang.exists('pwaifugames.fight.' + responses.fight)) {
            ++responses.fight;
        }

        while ($.lang.exists('pwaifugames.catchmiss.' + responses.miss)) {
            ++responses.miss;
        }
    }

        /*
         * @function getWaifuByName
         * @info Gets the waifu string by searching for its name in the db.
         *
         * @param {String} name
         * @return {String} waifu name; will return "" if the waifu does not exist.
         */
    function getWaifuByName(name) {
        var results = $.inidb.searchByValue('pokemon', name)[0];

        return (results === undefined ? '' : $.lang.get('pwaifugames.waifu.' + results));
    }

    /*
     * @function getWaifuById
     * @info Gets the waifu string by searching for its id
     *
     * @param {Number} id
     * @return {String} waifu name; will return "" if the waifu does not exist.
     */
    function getWaifuById(id) {
        return ($.lang.exists('pwaifugames.waifu.' + id) ? $.lang.get('pwaifugames.waifu.' + id) : '');
    }

    /*
     * @function getWaifu
     * @info Gets the waifu string by either searching for its name, or by its id.
     *
     * @param {Number|String} waifu
     * @return {String} waifu name; will return "" if the waifu does not exist.
     */
    function getWaifu(waifu) {
        return (isNaN(parseInt(waifu)) ? getWaifuByName(waifu) : getWaifuById(waifu));
    }

    /*
     * @function waifuExists
     * @info Checks if a waifu exist
     *
     * @param {Number|String} waifu
     * @return {Boolean}
     */
    function waifuExists(waifu) {
        return (isNaN(parseInt(waifu)) ? (getWaifuByName(waifu) !== '') : (getWaifuById(waifu) !== ''));
    }

    /*
     * @function getWaifuIdByName
     * @info Gets the waifu id by its name.
     *
     * @param {String} name
     * @return {Number} waifu id; will return 0 if it does not exist.
     */
    function getWaifuIdByName(name) {
        var results = $.inidb.searchByValue('pokemon', name)[0];

        return (results === undefined ? 0 : results);
    }

    /*
     * @function getWaifuId
     * @info Gets the waifu id by its name or id
     *
     * @param {String} name
     * @return {Number} waifu id; will return 0 if it does not exist.
     */
    function getWaifuId(name) {
        return (isNaN(parseInt(name)) ? getWaifuIdByName(name) : name);
    }

    /*
     * @function hasWaifu
     * @info Used to check if a user has a specific waifu.
     *
     * @param {String} username
     * @param {Number|String} id or waifu name; warning the name might not be accurate.
     * @return {Boolean}
     */
    function hasWaifu(username, id) {
        return (isNaN(parseInt(id)) ? $.inidb.HasKey(username, 'pwaifus', getWaifuIdByName(id)) : $.inidb.HasKey(username, 'pwaifus', id));
    }

    /*
     * @function getTotalUserWaifus
     * @info Used to get the amount of waifus a user has.
     *
     * @param {String} username
     * @return {Number} total amount of waifus the user has; can be 0
     */
    function getTotalUserWaifus(username) {
        return $.inidb.GetKeyList(username, 'pwaifus').length;
    }

    /*
     * @function getUserWaifuCount
     * @info Used to get the amount of waifus a user has with that id
     *
     * @param {String} username
     * @param {Number} id
     * @return {Number} total amount of waifus that user has with that id; can be 0
     */
    function getUserWaifuCount(username, id) {
        return ($.inidb.HasKey(username, 'pwaifus', getWaifuId(id)) ? $.inidb.GetInteger(username, 'pwaifus', getWaifuId(id)) : 0);
    }

    /*
     * @function getWins
     * @info Used to get the amount of Wins
     *
     * @param {String} username
     */
    function getWins(username) {
        return ($.inidb.exists(username, 'pWins') ? $.inidb.get(username, 'pWins') : 0);
    }

    /*
     * @function getLosses
     * @info Used to get the amount of Losses
     *
     * @param {String} username
     */
    function getLosses(username) {
        return ($.inidb.exists(username, 'pLosses') ? $.inidb.get(username, 'pLosses') : 0);
    }

    /*
     * @function getCandy
     * @info Used to get the amount of candy
     *
     * @param {String} username
     * @return {Number} total amount of candy that user has; can be 0
     */
    function getCandy(username) {
        return ($.inidb.exists(username, 'pcandy') ? $.inidb.get(username, 'pcandy') : 0);
    }

    /*
     * @function getEXP
     * @info Used to get the amount of EXP a waifu has
     *
     * @param {String} username
     * @param {Number} id
     * @return {Number} total amount of EXP that waifu has; can be 0
     */
    function getEXP(username, id) {
        return ($.inidb.HasKey(username, 'pharem', id) ? $.inidb.GetInteger(username, 'pharem', id) : 0);
    }

    /*
     * @function getLevel
     * @param id
     * @return gets waifu level
     */
    function getLevel(username, id) {
        if (getEXP(username, id) <= 0) {
            return 1;
        }
        return Math.round((Math.sqrt(getEXP(username, id) / 12)));
    }

    /*
     * @function getHitPoints
     * @param id
     * @return gets the hitpoints of a waifu in the user's harem
     */
    function getHitPoints(username, id) {
        if ($.inidb.GetInteger(username, 'pHitPoints', id) <= 0) {
            return 0;
        } else {
            return ($.inidb.HasKey(username, 'pHitPoints', id) ? ($.inidb.GetInteger(username, 'pHitPoints', id) >= 100 ? 100 : $.inidb.GetInteger(username, 'pHitPoints', id)) : 0);
        }
    }

    /*
     * @function getAttack
     * @param id
     * @return gets the attack of a waifu in the user's harem
     */
    function getAttack(username, id) {
        return ($.inidb.HasKey(username, 'pAttack', id) ? $.inidb.GetInteger(username, 'pAttack', id) : 0);
    }

    /*
     * @function getDefense
     * @param id
     * @return gets the defense of a waifu in the user's harem
     */
    function getDefense(username, id) {
        return ($.inidb.HasKey(username, 'pDefense', id) ? $.inidb.GetInteger(username, 'pDefense', id) : 0);
    }

    /*
     * @function getLove
     * @param id
     * @return gets the Love of a waifu in the user's harem
     */
    function getLove(username, id) {
        return ($.inidb.HasKey(username, 'pLove', id) ? $.inidb.GetInteger(username, 'pLove', id) : 0);
    }

    /*
     * @function getLewd
     * @param id
     * @return gets the lewdness of a waifu in the user's harem
     */
    function getLewd(username, id) {
        return ($.inidb.HasKey(username, 'pLewdness', id) ? $.inidb.GetInteger(username, 'pLewdness', id) : 0);
    }

    /*
     * @function getRandomHaremIdFromUser
     * @info Will return a random harem id from that users harem list, can be 0 if he does not have any.
     *
     * @return {Number} harem id.
     */
    function getRandomHaremIdFromUser(username) {
        var keys = $.inidb.GetKeyList(username, 'pharem'),
            temp = [];

        for (var i = 0; i < keys.length; i++) {
            temp.push(keys[i]);
        }
        if (temp.length > 0) {
            return $.randElement(temp);
        } else {
            return 0;
        }
    }

    /*
     * @function getRandomHaremNameFromUser
     * @info Will return a random harem name from that users harem list, can be '' if he does not have any.
     *
     * @return {String} harem name.
     */
    function getRandomHaremNameFromUser(username) {
        var keys = $.inidb.GetKeyList(username, 'pharem'),
            temp = [];

        for (var i = 0; i < keys.length; i++) {
            temp.push($.inidb.GetString(username, 'pharem', keys[i]));
        }

        if (temp.length > 0) {
            return $.randElement(temp);
        } else {
            return '';
        }
    }

    /*
     * @function isMarried
     * @info Checks if a user is married
     *
     * return {Boolean}
     */
    function isMarried(username) {
        return $.inidb.exists(username, 'pmarried');
    }

    /*
     * @function getMarried
     * @info Pulls married waifu id
     *
     * return {Boolean}
     */
    function getMarried(username) {
        return ($.inidb.exists(username, 'pmarried') ? $.inidb.get(username, 'pmarried') : 0);
    }

    /*
     * @function hasHarem
     * @info Used to check if a user has a specific harem.
     *
     * @param {String} username
     * @param {Number|String} id or waifu name; warning the name might not be accurate.
     * @return {Boolean}
     */
    function hasHarem(username, id) {
        return (isNaN(parseInt(id)) ? $.inidb.HasKey(username, 'pharem', getWaifuIdByName(id)) : $.inidb.HasKey(username, 'pharem', id));
    }

    /*
     * @function getHarem
     * @info Gets a harem from a user.
     *
     * @param {Number|String} waifu
     * @return {String} harem name; will return "" if the user does not own that harem
     */
    function getHarem(username, waifu) {
        return ($.inidb.HasKey(username, 'pharem', getWaifuId(waifu)) ? $.inidb.GetString(username, 'pharem', getWaifuId(waifu)) : '');
    }

    /*
     * @function getTotalUserHarems
     * @info Used to get the amount of harems a user has.
     *
     * @param {String} username
     * @return {Number} total amount of waifus the user has; can be 0
     */
    function getTotalUserHarems(username) {
        return ($.inidb.GetKeyList(username, 'pharem').length !== 0 ? $.inidb.GetKeyList(username, 'pharem').length : 0);
    }

    /*
     * @function getReward
     * @info Retrieve reward data
     *
     * @param {String} reward
     */
    function getReward(reward) {
        return ($.inidb.exists('psettings', 'pReward') ? $.inidb.get('psettings', 'pReward') : 100);
    }

    /*
     * @function getFReward
     * @info Retrieve reward data
     *
     * @param {String} reward
     */
    function getFReward(reward) {
        return ($.inidb.exists('psettings', 'pFReward') ? $.inidb.get('psettings', 'pFReward') : 25);
    }

    /*
     * @function replace
     *
     * @param {String} str
     * @return {String}
     */
    function replace(str) {
        return str.replace(/=/, '(').replace('[Legendary]', '').replace(/=/g, ')');
    }

    /*
     * @function url
     *
     * @param {String} str
     * @return {String}
     */
    function url(str) {
        return str.replace('\'', '%27');
    }

    /*
     * @function updateBattleStats
     * @info Used to update a users stats after a battle
     *
     * @param {String} username
     * @param {Array} array
     * @param {Number} id
     * @param {Boolean} isDecr
     */
    function updateBattleStats(username, array, id, isDecr) {
        var rnd;

        $.inidb.setAutoCommit(false);
        for (var i = 0; i < array.length; i++) {
            rnd = $.randRange(0, 1);
            if (isDecr === false) {
                $.inidb.incr(username, array[i], getWaifuId(id), rnd);
            } else {
                if ($.inidb.GetInteger(username, array[i], getWaifuId(id)) > 0) {
                    $.inidb.decr(username, array[i], getWaifuId(id), rnd);
                }
            }
        }
        $.inidb.incr(username, 'pharem', getWaifuId(id), 5);
        $.inidb.setAutoCommit(true);
    }

    function rareChance() {
        var toggle = $.inidb.exists('psettings', 'rChance') ? $.inidb.get('psettings', 'rChance') : 'false';

        if (toggle == 'false') {
            $.say($.lang.get('pwaifugames.rare.chance'));
            $.panelsocketserver.alertImage('rarechance.gif' + ',4');
            $.inidb.set('psettings', 'rChance', 'true');
        } else {
            $.say($.lang.get('pwaifugames.rare.over'));
            $.inidb.set('psettings', 'rChance', 'false');
        }
    }

    /*
     * function catchWaifu
     * @info Used to catch random waifus.
     *
     * @param {String} username
     */
    function catchWaifu(username) {
        var id = $.randRange(1, 802),
            missR = $.randRange(1, responses.miss - 1),
            unlock = $.randRange(1, 2),
            chance = $.randRange(1, 5),
            reward = getReward(),
            waifu = getWaifu(id),
            link = (google + url(waifu)),
            candy = '',
            candy2 = '',
            candyDrop = $.randRange(1, 2);
        rare = '';

        if (waifu.includes('[Legendary]')) {
            rare = ('/me RARE! +' + $.getPointsString(reward) + ' ');
            if ($.inidb.get('psettings', 'rChance') == 'true') {
                chance = $.randRange(1, 4);
            } else {
                chance = $.randRange(1, 15);
            }

            $.panelsocketserver.alertImage(navigatorImg + ',5');
            $.inidb.incr('points', username, reward);
        }

        if (chance >= 4 && candyDrop > 1) {
            $.inidb.incr(username, 'pcandy', 1);
            candy = $.lang.get('pwaifugames.candy.dropped');
            candy2 = $.lang.get('pwaifugames.candy.dropped2');
        }

        if (chance <= 4) {
            if (hasWaifu(username, id)) {
                $.inidb.incr(username, 'pwaifus', id, unlock);
                $.say($.lang.get('pwaifugames.catch.own', rare + $.userPrefix(username, true), unlock, replace(waifu), id, $.shortenURL.getShortURL(link) + candy));
            } else {
                $.inidb.SetInteger(username, 'pwaifus', id, unlock);
                $.say($.lang.get('pwaifugames.catch.new', rare + $.userPrefix(username, true), unlock, replace(waifu), id, $.shortenURL.getShortURL(link) + candy));
            }
        } else {
            $.say($.lang.get('pwaifugames.catchmiss.' + missR, $.userPrefix(username, true), replace(waifu), id, candy2));
            return;
        }
    }

    /*
     * function randomWaifu
     * @info Used to get a random waifu.
     *
     * @param {String} username
     */
    function randomWaifu(username) {
        var id = $.randRange(1, 802),
            waifu = getWaifu(id),
            link = (google + url(waifu));

        if (getTotalUserWaifus(username) === 0) {
            $.say($.lang.get('pwaifugames.random.0', $.whisperPrefix(username)));
        } else {
            if (!isMarried(username)) {
                $.say($.lang.get('pwaifugames.random.success', $.userPrefix(username, true), replace(waifu), id, $.shortenURL.getShortURL(link)));
            } else {
                id = getWaifuId(getMarried(username));
                link = (google + url(getWaifu(id)));
                $.say($.lang.get('pwaifugames.random.married', $.userPrefix(username, true), replace(getWaifu(id)), id, getHitPoints(username, id), getLevel(username, id), getAttack(username, id), getDefense(username, id), getLove(username, id), $.shortenURL.getShortURL(link)));
            }
        }
    }

    /*
     * function sendWaifu
     * @info Used to send someone a waifu.
     *
     * @param {String} username
     * @param {String} receiver
     * @param {Number} id
     */
    function sendWaifu(username, receiver, id) {
        if (!waifuExists(id)) {
            $.say($.lang.get('pwaifugames.exist.404', $.whisperPrefix(username)));
            return;
        }

        id = getWaifuId(id);

        var waifu = getWaifu(id),
            link = (google + url(waifu));

        if (getUserWaifuCount(username, id) > 0) {
            $.say($.lang.get('pwaifugames.giftwaifu.success', $.userPrefix(username, true), replace(waifu), $.userPrefix(receiver, false), $.shortenURL.getShortURL(link)));
            $.inidb.incr(receiver.toLowerCase(), 'pwaifus', id, 1);
            $.inidb.decr(username, 'pwaifus', id, 1);
        } else {
            $.say($.lang.get('pwaifugames.giftwaifu.404', $.userPrefix(username, true)));
        }
    }

    /*
     * @function waifuProfile
     * @info Used to get your current profile of waifus.
     */
    function waifuProfile(username) {
        $.say($.lang.get('pwaifugames.profile.success', $.whisperPrefix(username), getTotalUserWaifus(username), totalWaifus, getCandy(username), Math.floor((getTotalUserWaifus(username) / totalWaifus) * 100), getWins(username), getLosses(username)));
    }

    /*
     * @function setWaifu
     * @info Used to set a waifu.
     *
     * @param {String} username
     * @param {Number} id
     */
    function setWaifu(username, id) {
        if (id === undefined) {
            $.say($.lang.get('pwaifugames.marry.null', $.whisperPrefix(username)));
            return;
        }

        if (isMarried(username)) {
            $.say($.lang.get('pwaifugames.marry.already', $.whisperPrefix(username), replace(getWaifu(getMarried(username)))));
            return;
        }

        if (!hasHarem(username, id)) {
            $.say($.lang.get('pwaifugames.harem.kick404'));
            return
        }

        if (waifuExists(id) && hasWaifu(username, id)) {
            $.inidb.set(username, 'pmarried', getWaifuId(id));
            $.inidb.incr(username, 'pLove', getWaifuId(id), 50);
            $.inidb.incr(username, 'pLewdness', getWaifuId(id), 20);
            $.say($.lang.get('pwaifugames.marry.success', $.userPrefix(username, true), replace(getWaifu(id))));

        } else {
            $.say($.lang.get('pwaifugames.exist.404', $.whisperPrefix(username)));
        }
    }

    /*
     * @function resetWaifu
     * @info Removes married waifu.
     *
     * @param {String} username
     */
    function resetWaifu(username) {
        if (isMarried(username)) {
            $.say($.lang.get('pwaifugames.split.success', $.whisperPrefix(username), replace(getWaifu(getMarried(username)))));
            $.inidb.del(username, 'pmarried');
            $.inidb.decr(username, 'pLove', getMarried(username), 60);
            $.inidb.decr(username, 'pLewdness', getMarried(username), 20);
        } else {
            $.say($.lang.get('pwaifugames.split.404', $.whisperPrefix(username)));
        }
    }

        /*
         * @function buyWaifu
         * @info Used to buy waifus
         *
         * @param {String} username
         * @param {Number} id
         */
    function buyWaifu(username, id) {
        if (!waifuExists(id)) {
            $.say($.lang.get('pwaifugames.exist.404', $.whisperPrefix(username)));
            $.inidb.incr('points', username, $.inidb.get('pricecom', 'buywaifu'));
            return;
        }

        var waifu = getWaifu(id),
            link = (google + url(waifu));

            $.inidb.incr(username, 'pwaifus', getWaifuId(id), 1);
            $.say($.lang.get('pwaifugames.buywaifu.new', $.userPrefix(username, true), replace(waifu), getWaifuId(id), $.shortenURL.getShortURL(link)));

    }

    /*
     * @function buyCandy
     * @info Used to buy candy
     *
     * @param {Number} id
     */
    function buyCandy(sender, amount) {
        var price = $.inidb.get('pricecom', 'buycandy');

        if (amount >= 1 && $.inidb.get('points', sender) >= price * amount) {
            $.inidb.incr(sender, 'pcandy', amount);
            $.inidb.decr('points', sender, ((price * amount) - price));
            $.say($.lang.get('pwaifugames.candy.buy', $.whisperPrefix(sender), amount, $.getPointsString(price * amount), getCandy(sender)));
        } else {
            amount = 1;
            $.inidb.incr(sender, 'pcandy', amount);
            $.say($.lang.get('pwaifugames.candy.buy', $.whisperPrefix(sender), amount, $.getPointsString(price), getCandy(sender)));
        }

    }

    /*
     * @function checkWaifu
     * @info Checks if a user owns that harem
     *
     * @param {String} username
     * @param {Number} id
     */
    function checkWaifu(sender, id) {
        if (!waifuExists(id)) {
            $.say($.lang.get('pwaifugames.exist.404', $.whisperPrefix(sender)));
            return;
        }

        id = getWaifuId(id);

        var waifu = getWaifu(id),
            link = (google + url(waifu)),
            stats = '';

        if (hasHarem(sender, id)) {
            stats = $.lang.get('pwaifugames.checkwaifu.stats', getHitPoints(sender, id), getLevel(sender, id), getAttack(sender, id), getDefense(sender, id), getLove(sender, id));
        }

        $.say($.lang.get('pwaifugames.checkwaifu.success', $.userPrefix(sender, true), getUserWaifuCount(sender, id), replace(getWaifu(id)), id, stats, $.shortenURL.getShortURL(link)));
    }

    /*
     * @function addHarem
     * @info Adds a harem to that users list
     *
     * @param {String} username
     * @param {Number} id
     */
    function addHarem(username, id) {
        var hp = 100,
            atk = 1,
            def = 1,
            love = 1,
            lewd = 1;

        if (!waifuExists(id)) {
            $.say($.lang.get('pwaifugames.exist.404', $.whisperPrefix(username)));
            return;
        }

        if (hasHarem(username, id)) {
            $.say($.lang.get('pwaifugames.harem.repeat', $.whisperPrefix(username)));
            return;
        }

        if (!hasWaifu(username, id)) {
            $.say($.lang.get('pwaifugames.harem.owned', $.whisperPrefix(username)));
            return;
        }

        if (getTotalUserHarems(username) >= 6) {
            $.say($.lang.get('pwaifugames.harem.denied'));
            return;
        }

        if (getWaifu(id).includes('[Legendary]')) {
            atk = $.randRange(1, 20), def = $.randRange(1, 20), love = $.randRange(1, 30), lewd = 10;
        }

        $.inidb.SetString(username, 'pharem', getWaifuId(id), 1);
        $.inidb.SetString(username, 'pHitPoints', getWaifuId(id), hp);
        $.inidb.SetString(username, 'pAttack', getWaifuId(id), atk);
        $.inidb.SetString(username, 'pDefense', getWaifuId(id), def);
        $.inidb.SetString(username, 'pLove', getWaifuId(id), love);
        $.inidb.SetString(username, 'pLewdness', getWaifuId(id), lewd);
        $.say($.lang.get('pwaifugames.harem.success', $.userPrefix(username, true), replace(getWaifu(id))));
    }

    /*
     * @function kickHarem
     * @info USed to kick a harem
     *
     * @param {String} username
     * @param {Number|String} id
     */
    function kickHarem(username, id) {
        if (getEXP(username, getWaifuId(id)) >= 1) {
            $.inidb.RemoveKey(username, 'pharem', getWaifuId(id));
            $.inidb.RemoveKey(username, 'pHitPoints', getWaifuId(id));
            $.inidb.RemoveKey(username, 'pAttack', getWaifuId(id));
            $.inidb.RemoveKey(username, 'pDefense', getWaifuId(id));
            $.inidb.RemoveKey(username, 'pLove', getWaifuId(id));
            $.inidb.RemoveKey(username, 'pLewdness', getWaifuId(id));
            $.say($.lang.get('pwaifugames.harem.kick', replace(getWaifu(id))));
        } else {
            $.say($.lang.get('pwaifugames.harem.kick404'));
        }
    }

    /*
     * @function getHarem
     * @info Used to get a harem
     *
     * @param {String} username
     */
    function getHarem(username) {
        var keys = $.inidb.GetKeyList(username, 'pharem'),
            array = [];

        for (var i = 0; i < keys.length; i++) {
            array.push(replace($.lang.get('pwaifugames.waifu.' + keys[i])) + ' #' + keys[i]);
        }

        if (array.length >= 1) {
            $.say($.lang.get('pwaifugames.harem.get', $.whisperPrefix(username), array.join(', ')));
        } else {
            $.say($.lang.get('pwaifugames.harem.404'));
        }
    }

    /*
     * @function getCandy
     * @info USed to get candy amount
     *
     * @param {String} sender
     */
    function useCandy(username, amount, id) {
        var candy = $.inidb.get(username, 'candy');

        if (getCandy(username) < 1) {
            $.say($.lang.get('pwaifugames.candy.nostock', $.whisperPrefix(username)));
            return;
        }

        if (id === '') {
            id = getWaifuId(amount);
            amount = 1;
        } else {
            id = getWaifuId(id);
            amount = amount;
        }

        if (!waifuExists(id)) {
            $.say($.lang.get('pwaifugames.exist.404', $.whisperPrefix(username)));
            return;
        } else {
            if (!hasHarem(username, id)) {
                $.say($.lang.get('pwaifugames.candy.missing', $.whisperPrefix(username)));
                return;
            }
        }

        if (amount > candy) {
            $.say($.lang.get('pwaifugames.candy.nostock', $.whisperPrefix(username)));
            return
        }


        $.inidb.incr(username, 'pharem', id, (100 * amount));
        $.inidb.SetInteger(username, 'pHitPoints', id, 100);
        $.inidb.incr(username, 'pAttack', id, amount);
        $.inidb.incr(username, 'pDefense', id, amount);
        $.inidb.incr(username, 'pLove', id, amount);
        $.inidb.incr(username, 'pLewdness', id, amount);
        $.inidb.decr(username, 'pcandy', amount);
        $.say($.lang.get('pwaifugames.candy.use', $.whisperPrefix(username), replace(getWaifu(id)), (100 * amount), getEXP(username, id), getHitPoints(username, id), getLevel(username, id), getAttack(username, id), getDefense(username, id), getCandy(username, id)));
    }

    /*
     * @function battle
     * @param opponent
     * @return Battle with another waifu
     */
    function startBattle(username, opponent, action) {
        var random1 = $.randRange(1, responses.attack - 1),
            random2 = $.randRange(1, responses.fight - 1),
            id,
            id2 = getRandomHaremIdFromUser(opponent),
            waifu1,
            waifu2,
            player1 = $.userPrefix(username),
            player2 = $.userPrefix(opponent),
            attack = $.lang.get('pwaifugames.attack.' + random1),
            dmg,
            dmgRec,
            dmgMsg = '',
            winMsg = '';



        if (action !== '') {
            id = getWaifuId(action);
        } else if (isMarried(username) && getHitPoints(username, getMarried(username)) > 1) {
            id = getMarried(username);
        } else {
            id = getRandomHaremIdFromUser(username);
        }

        if (isMarried(opponent) && getHitPoints(opponent, getMarried(opponent)) > 1) {
            id2 = getMarried(opponent);
        } else {
            id2 = getRandomHaremIdFromUser(opponent);
        }

        waifu1 = getWaifu(id);
        waifu2 = getWaifu(id2);

        if (opponent.equalsIgnoreCase(username)) {
            $.say($.lang.get('pwaifugames.harem.same'));
            return;
        }

        if (getTotalUserHarems(opponent) <= 0) {
            $.say($.lang.get('pwaifugames.harem.fight4042'));
            return;
        } else {
            if (getTotalUserHarems(username) <= 0) {
                $.say($.lang.get('pwaifugames.harem.fight404'));
                return;
            }
        }

        if (getAttack(username, id) >= getDefense(opponent, id2)) {
            dmg = Math.floor($.randRange(getDefense(opponent, id2), getAttack(username, id)) / 3 - getDefense(opponent, id2) / 3);
        } else {
            dmg = Math.floor($.randRange(0, getAttack(username, id) / 6));
        }

        if (getDefense(opponent, id2) >= getAttack(username, id)) {
            dmgRec = Math.floor($.randRange(getAttack(username, id), getDefense(opponent, id2)) / 3 - getAttack(username, id) / 3);
        } else {
            dmgRec = Math.floor($.randRange(0, getAttack(opponent, id2) / 6));
        }

        if (getHitPoints(username, id) < 1) {
            $.say($.lang.get('pwaifugames.player.nohp', player1, replace(waifu1)));
            return;
        } else if (getHitPoints(opponent, id2) < 1) {
            $.say($.lang.get('pwaifugames.player.nohp', player2, replace(waifu2)));
            return;
        } else {
            updateBattleStats(username, ['pLove', 'pDefense'], id, true);
            updateBattleStats(username, ['pLewdness', 'pAttack', 'pDefense'], id, false);
            updateBattleStats(opponent, ['pLewdness', 'pAttack', 'pDefense'], id2, false);
            $.inidb.incr(username, 'pharem', id, 25);
            $.inidb.incr(opponent, 'pharem', id2, 25);
            $.inidb.decr(opponent, 'pHitPoints', id2, dmg);
            $.inidb.decr(username, 'pHitPoints', id, dmgRec);

            if ($.inidb.GetInteger(username, 'pHitPoints', id) <= 0) {
                winMsg = $.lang.get('pwaifugames.win.fight', player2, replace(waifu2), player1, replace(waifu1), $.getPointsString(getFReward()));
                $.inidb.incr('points', opponent, getFReward());
                $.inidb.incr(opponent, 'wWins', 1);
                $.inidb.incr(username, 'wLosses', 1);
            }

            if ($.inidb.GetInteger(username, 'pHitPoints', id) <= 0 && $.inidb.GetInteger(opponent, 'pHitPoints', id2) <= 0) {
                winMsg = $.lang.get('pwaifugames.win.draw', player1, replace(waifu1), player2, replace(waifu2));
            }

            if ($.inidb.GetInteger(opponent, 'pHitPoints', id2) <= 0) {
                winMsg = $.lang.get('pwaifugames.win.fight', player1, replace(waifu1), player2, replace(waifu2), $.getPointsString(getFReward()));
                $.inidb.incr('points', username, getFReward());
                $.inidb.incr(username, 'wWins', 1);
                $.inidb.incr(opponent, 'wLosses', 1);
            }

            var dmgRecMsg = $.lang.get('pwaifugames.fight.dmgrec', dmgRec);

            if (dmg === 0) {
                dmgMsg = $.lang.get('pwaifugames.fight.miss');
            } else {
                dmgMsg = $.lang.get('pwaifugames.fight.dmg', dmg);
            }

            $.say($.lang.get('pwaifugames.fight.' + random2, replace(waifu1), getHitPoints(username, id), dmgRecMsg, attack, dmgMsg, replace(waifu2), getHitPoints(opponent, id2), winMsg));

        }

    }

    /*
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            subAction = args[1];

        if (command.equalsIgnoreCase('pokedex')) {
            if (action === undefined) {
                randomWaifu(sender);
            } else {
                checkWaifu(sender, action);
            }
        }

        if (command.equalsIgnoreCase('battle')) {
            if (action === undefined) {
                $.say($.lang.get('pwaifugames.fight.usage'));
                return;
            }
            if ($.isOnline($.channelName)) {
                startBattle(sender, action.toLowerCase(), args.slice(1).join(' '));
            } else {
                $.say($.lang.get('pwaifugames.online.404', $.whisperPrefix(sender), $.channelName));
            }
        }

        if (command.equalsIgnoreCase('pcandy')) {
            if (action === undefined) {
                $.say($.lang.get('pwaifugames.candy.get', $.whisperPrefix(sender), getCandy(sender)));
            } else {
                useCandy(sender, action, subAction);
            }
        }

        if (command.equalsIgnoreCase('buypcandy')) {
            buyCandy(sender, action);
        }

        if (command.equalsIgnoreCase('team')) {
            getHarem(sender);
        }

        if (command.equalsIgnoreCase('addteam')) {
            if (action === undefined) {
                $.say($.lang.get('pwaifugames.addharem.usage'));
            } else {
                addHarem(sender, action);
            }
        }

        if (command.equalsIgnoreCase('kickteam')) {
            if (action === undefined) {
                $.say($.lang.get('pwaifugames.kickharem.usage'));
            } else {
                kickHarem(sender, action);
            }
        }

        if (command.equalsIgnoreCase('resetteam')) {
            $.inidb.RemoveSection(sender, 'pharem');
            $.say($.whisperPrefix(sender) + $.lang.get('pwaifugames.harem.reset'));
        }

        if (command.equalsIgnoreCase('catch')) {
            if ($.isOnline($.channelName)) {
                catchWaifu(sender);
            } else {
                $.say($.lang.get('pwaifugames.online.404', $.whisperPrefix(sender), $.channelName));
            }
        }

        if (command.equalsIgnoreCase('giftpokemon')) {
            sendWaifu(sender, action, subAction);
        }

        if (command.equalsIgnoreCase('buypokemon')) {
            buyWaifu(sender, action);
        }

        if (command.equalsIgnoreCase('pokefile')) {
            waifuProfile(sender);
        }

        if (command.equalsIgnoreCase('setpokemon')) {
            setWaifu(sender, action);
        }

        if (command.equalsIgnoreCase('resetpokemon')) {
            resetWaifu(sender);
        }

        if (command.equalsIgnoreCase('legendchance')) {
            rareChance(action);
        }

        if (command.equalsIgnoreCase('pokereward')) {
            if (action === undefined) {
                $.say($.lang.get('pwaifugames.reward.get', $.getPointsString(getReward())));
            } else {
                $.inidb.set('settings', 'pReward', action);
                $.say($.lang.get('pwaifugames.reward.set', $.getPointsString(action)));
            }
        }

        if (command.equalsIgnoreCase('battlereward')) {
            if (action === undefined) {
                $.say($.lang.get('pwaifugames.fightreward.get', $.getPointsString(getFReward())));
            } else {
                $.inidb.set('settings', 'pFReward', action);
                $.say($.lang.get('pwaifugames.fightreward.set', $.getPointsString(action)));
            }
        }

        if (command.equalsIgnoreCase('pokemonhelp')) {
            $.say($.whisperPrefix(sender) + $.lang.exists('pwaifugames.waifuhelp'));
        }
    });

    /*
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./games/pokemonSystem.js')) {
            $.registerChatCommand('./games/pokemonSystem.js', 'pokedex', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'pokefile', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'battle', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'pcandy', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'buypcandy', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'catch', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'giftpokemon', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'resetpokemon', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'setpokemon', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'buypokemon', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'team', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'addteam', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'kickteam', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'resetteam', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'pokemonhelp', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'legendchance', 1);
            $.registerChatCommand('./games/pokemonSystem.js', 'pokereward', 1);
            $.registerChatCommand('./games/pokemonSystem.js', 'battlereward', 1);
            load();
        }
    });
})();