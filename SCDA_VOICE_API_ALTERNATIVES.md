# Voice API Alternatives for SCDA MamaCare (Ghana)

Since Africa's Talking is experiencing delays in provisioning a Voice API number, the following alternatives have been researched. These providers specialize in the Ghanaian and African markets, offering programmable voice, IVR capabilities, and localized integration.

## 1. Arkesel (Clarification: Voice SMS / Bulk Voice)
*Note: As confirmed, Arkesel is primarily a Voice SMS (Voice Blast) API rather than a fully programmable Voice API with dynamic XML-based IVR (like Africa's Talking or Twilio).*
- **Key Features:** Bulk Voice SMS, OTPs, SMS, USSD, and WhatsApp integration.
- **Limitation for IVR:** Arkesel uses standard RESTful JSON to trigger calls and receive webhooks, but it **lacks** a dynamic programmable XML engine (like `<Say>`, `<Record>`, `<Gather>`) needed for real-time, interactive, branching IVR flows. It is excellent for outbound notifications but not ideal for replacing Africa's Talking's inbound/outbound IVR tree.
- **Billing:** Local-currency billing (GHS) and Mobile Money integration.

## 2. Hubtel 
Hubtel is another major Ghanaian provider. While heavily focused on payments and SMS, they offer programmable USSD and SMS. 
- **Limitation:** Similar to Arkesel, their Voice offerings lean towards bulk Voice SMS rather than complex programmable IVR.

## 3. Telerivet (Best Technical Alternative for True IVR)
Telerivet provides a robust engine for building complex communication workflows and is widely used by NGOs across Africa.
- **Key Features:** Cloud platform for building dynamic IVR menus via a drag-and-drop interface or developer API.
- **Why it fits MamaCare:** Since acquiring a local virtual number in Ghana is extremely difficult (even global giants like Twilio do *not* offer local Ghanaian virtual numbers), Telerivet allows a **"Gateway" approach**. You can install the Telerivet Gateway app on a local Android phone with a local MTN/Telecel SIM card. Telerivet will then route inbound and outbound programmable IVR calls through that physical phone, completely bypassing the wait for a virtual number from an API provider.

## 4. Sendexa & Resolv (by Dial Afrika)
- **Sendexa:** Provides Voice OTPs and customizable IVR flows with native Text-to-Speech (TTS) in **Twi** and **Hausa**.
- **Resolv:** Unifies voice, SMS, WhatsApp, and AI agents tuned for Ghanaian English and Twi.

---

### Updated Recommendation
1. **If you need true, dynamic Programmable Voice (IVR) immediately:** Use **Telerivet** with an Android phone acting as a local gateway. This completely circumvents the wait time for a virtual number while giving you full IVR capabilities.
2. **If you just need outbound alerts/reminders:** **Arkesel** remains the best local choice for blasting voice messages, but it cannot handle complex inbound IVR triage.
