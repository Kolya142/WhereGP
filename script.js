const script_s_whereGP_version = 5;

if (localStorage.getItem("WGPversion") === null) {
    if (localStorage.getItem("mypriv") !== null)
        localStorage.setItem("WGPversion", "4");
    else
        localStorage.setItem("WGPversion", String(script_s_whereGP_version));
}

const user_s_whereGP_version = Number(localStorage.getItem("WGPversion"));

console.log(user_s_whereGP_version);

// 4 - before version counting.
// 5 - added version counting. added "Owner" contact.

if (!window.localization) {
    alert("There is no localization!!1!");
}

function validateEmail(email) { // https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript#46181
    return !!(String(email)
              .toLowerCase()
              .match(
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              ));
};

async function gk() {
    alert(localization.this_inf_for_key);
    const q_name = prompt(localization.enter_fn);
    let q_email = prompt(localization.enter_em);
    while (!validateEmail(q_email)) {
        q_email = prompt(localization.enter_em_inv);
    };
    const key = await openpgp.generateKey({
        userIDs: { name: q_name, email: q_email },
        type: 'ecc',
        curve: 'curve25519',
        format: 'object'
    });
    const pa = key.publicKey.armor();
    localStorage.setItem("mypriv", key.privateKey.armor());
    localStorage.setItem("mypub", pa);

    let contact_arr = JSON.parse(localStorage.getItem("contact"));
    contact_arr["Owner"] = pa; // Some people may know two languages.
    localStorage.setItem("contact", JSON.stringify(contact_arr));
    update_contacts_list();
}

async function cwo() {
    out.select();
    out.setSelectionRange(0, 9999999999);
    navigator.clipboard.writeText(out.value);
}

async function cif() {
    contq.value = "";
    inp.value = "";
    out.value = "";
}

let do_restrict_real_names = true;

async function rrn() {
    do_restrict_real_names = !do_restrict_real_names;
    if (do_restrict_real_names)
        _rrn.value = localization.d_rs_rl_nms;
    else
        _rrn.value = localization.rs_rl_nms;
    update_contacts_list();
}

async function tlt() {
    legal_things.hidden = !legal_things.hidden;
    if (legal_things.hidden)
        _tlt.value = localization.sh_legal_th;
    else
        _tlt.value = localization.hd_legal_th;
}

async function cek() {
    if (prompt(localization.ch_key_cnfm) == localization.exp_tpe) {
        const k = prompt(localization.ch_key);
        if (k == localization.ch_key_priv_cnfm) {
            localStorage.setItem("mypriv", inp.value);
        }
        if (k == localization.ch_key_pub_cnfm) {
            localStorage.setItem("mypub", inp.value);
        }
    }
}

async function gsek() {
    if (prompt(localization.gt_key_cnfm) == localization.exp_tpe) {
        out.value = localStorage.getItem("mypriv");
    }
}

async function adb() {
    let contact_arr = JSON.parse(localStorage.getItem("contact"));
    contact_arr[contq.value] = inp.value;
    localStorage.setItem("contact", JSON.stringify(contact_arr));
    out.value = localization.welcome_cn + contq.value;
    update_contacts_list();
}

async function gtk() {
    out.value = localStorage.getItem("mypub");
}

if (localStorage.getItem("mypriv") === null || localStorage.getItem("mypub") === null) gk();

if (user_s_whereGP_version < 5) {
    let contact_arr = JSON.parse(localStorage.getItem("contact"));
    contact_arr["Owner"] = localStorage.getItem("mypub"); // Some people may know two languages so i choosed English.
    localStorage.setItem("contact", JSON.stringify(contact_arr));
    update_contacts_list();
}

if (localStorage.getItem("contact") === null) localStorage.setItem("contact", "{}");

async function update_contacts_list() {
    contacts_list.innerHTML = "";
    let is_any = false;
    const contacts = JSON.parse(localStorage.getItem("contact"));
    for (let b of Object.keys(contacts)) {
        is_any = true;
        {
            const el = document.createElement('button');
            el.className = 'button';
            el.innerHTML = localization.del_cn_js;
            el.onclick = () => {
                if(confirm(localization.do_u_want_rm_cn+b+"?")) {
                    const p = JSON.parse(localStorage.getItem("contact"));
                    p[b] = undefined;
                    localStorage.setItem("contact", JSON.stringify(p));
                    update_contacts_list();
                }
            };
            contacts_list.appendChild(el);
        }
        {
            const el = document.createElement('button');
            el.className = 'button';
            el.innerHTML = localization.rn_cn_js;
            el.onclick = () => {
                if (confirm(localization.do_u_want_rn_cn+b+"?")) {
                    const nn = prompt(localization.ent_new_cn_nm+b);
                    const p = JSON.parse(localStorage.getItem("contact"));
                    p[nn] = p[b];
                    p[b] = undefined;
                    localStorage.setItem("contact", JSON.stringify(p));
                    update_contacts_list();
                }
            };
            contacts_list.appendChild(el);
        }
        {
            const el = document.createElement('button');
            el.className = 'button';
            const key = await openpgp.readKey({armoredKey: contacts[b]}); // FIXMEE: TOO SLOW
            if (do_restrict_real_names) {
                el.innerText = b + " ["+localization.rstd+"]";
            }
            else {
                if (key && key.users && key.users[0] && key.users[0].userID && key.users[0].userID.userID) {
                    el.innerText = b + " ["+key.users[0].userID.userID+"]";
                }
                else {
                    el.innerText = b + " ["+localization.inv_cn_id+"]";
                }
            }
            el.onclick = () => {
                contq.value = b;
            };
            contacts_list.appendChild(el);
        }
        {
            const el = document.createElement('br');
            contacts_list.appendChild(el);
        }
    }
    if (!is_any) contacts_list.innerHTML = localization.no_contacts;
}

update_contacts_list();

async function en() {
    let contact_arr = JSON.parse(localStorage.getItem("contact"));
    if (contact_arr[contq.value] === undefined) {
        contq.value = contq.value + localization.is_not_ur_cn;
    }
    const key = await openpgp.readKey({armoredKey: contact_arr[contq.value]});
    out.value = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: inp.value }),
        encryptionKeys: [key]
    });
}

async function de() {
    const key = await openpgp.readPrivateKey({armoredKey: localStorage.getItem("mypriv")});
    const msg = await openpgp.readMessage({ armoredMessage: inp.value });
    out.value = (await openpgp.decrypt({
        decryptionKeys: [key],
        message: msg
    })).data;
}

localStorage.setItem("WGPversion", String(script_s_whereGP_version));
