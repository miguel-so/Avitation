I want React + Typescript + Chakra UI version 2 web based admin portal dashboard and Node.js + ExpressJS + MySQL backend to interact with admin portal and avitation Landing page built in wordpress, avitation mobile apps.

So I want you to generate 2 projects. Web based admin portal and Backend

Here is breif explaination of the application workflow for your better understanding.

The overall design of Victor must treat victorexecutive.com as the central operational node of the ecosystem, not merely as a presentation website. The content needs a full revision so it reflects the current capabilities of the platform with clarity and structure. Core functionalities such as the QR Pass for passengers, the connection with government authorities, automated General Declaration generation, and the bidirectional data flow between the mobile app and the web environment must be explicitly visible. The rewritten content should be organized into clear sections. System architecture and technology. Operational tools for handlers, FBOs and operators. Regulatory compliance. Passenger-facing services and workflow improvements. Each section must highlight the features that truly differentiate Victor, such as offline operation, passport scanning, automatic document generation and role-based access, expressed in precise and comprehensible terms.
From a technical standpoint, the site must operate as part of the same architecture that includes the backend and the mobile app. A secure login zone must be added for operators, authorities and potential demo users, relying on a unified authentication layer that serves the site, the web portal and the mobile application equally. All business logic belongs in the backend. The site and portal simply act as clients that display and manipulate data through the backend’s API.
The data structure of the system depends on a set of core entities shared across all modules. Flights, passengers, crew members, documents, General Declarations, QR Pass objects for passengers, QR tags for baggage and authority notifications. All forms, both in the app and the web portal, are built on top of these shared models. The flight form contains all essential flight and aircraft data. Passenger and crew forms integrate identity information, passport data, contact details and any operational notes that automatically feed the General Declaration. Document forms attach templates to specific flights and support automatic field population and export in PDF, XML or JSON. Authority-oriented forms draw from the same database, eliminating duplicate entries and ensuring consistency.
The connection between the mobile application and the site relies exclusively on structured API communication. The website holds no business logic and does not access the database directly. All data flows through the backend, which exposes clear endpoints for flight creation and updates, passenger and crew management, document generation and retrieval, and the complete handling of QR Pass and baggage QR workflows. The Android app and the web portal both operate on this same backend. Any update performed in one environment must immediately reflect in the other without external spreadsheets or unofficial communication channels.
Access control is enforced through role-based permissions and strict content segmentation. Distinct user roles define what each user can see or modify. The Victor administrator has full visibility and access to system configurations, templates and logs. Operators and handling companies view only their own flights, passengers and documents. Ground handlers are linked to specific airports and see only assigned flights, with limited personal data strictly required for their operational task. Government authorities access General Declarations, passenger and crew lists, relevant documents and transmission logs, but no internal operational fields. Every screen, dataset and operation is tied to explicit permissions so that the interface adapts automatically to the user’s role, both in the app and the web portal.
A dedicated terminal for government authorities is created as a separate access point. This portal is available only after strong authentication and preferably a second verification factor. It provides real-time visibility into flights under their jurisdiction and access to General Declarations, manifests and related documents. These documents must be offered both in PDF and in structured form for future system-to-system integration. All actions performed by authority users are logged with user identity, timestamp and technical access details to ensure complete auditability for compliance with ICAO, IATA and national regulations.
Passport scanning within the mobile application serves as the primary source of truth for personal data. Every passport scan for a passenger or crew member automatically saves all required information for the General Declaration and manifests. The General Declaration is not filled in manually; it is generated automatically from the stored data. The operator reviews and confirms before final generation and transmission. Throughout this process, all personal data must remain encrypted at rest and transmitted only through secure, controlled channels, in full compliance with GDPR.
The QR Pass service is designed as the main passenger-facing workflow. Once a passenger is added to a flight and all required fields are complete, the system creates a unique Victor QR Pass linked to that specific flight and individual. The system monitors the scheduled departure time and automatically generates a digital pass twenty-four hours before the flight. This pass includes departure information, meeting point or FBO, handler details, access instructions and contact information. The embedded QR code corresponds only to a secure backend token and never to exposed personal data. The pass is sent automatically via email and optionally SMS, without requiring the passenger to create an account.
At the airport, handlers scan the passenger’s QR Pass through the Victor app. The scan instantly displays the flight, the passenger’s status and the information allowed for that specific role. Status updates such as arrival, ready for boarding and on board are recorded and displayed live on the operator’s dashboard, creating a clear operational timeline.
In parallel, the system generates QR tags for baggage linked to the flight and, when required, to specific passengers or groups. These tags are printed and attached to the luggage. During loading and unloading, handlers scan the tags to update the baggage status. This creates a basic but reliable baggage-tracking mechanism without requiring complex airline-level systems. In later stages, this dataset can be connected to simple load reports and weight estimates for enhanced load awareness.
Across all phases, every feature must pass structured testing and proper logging before moving into production. Personal data handling is treated with maximum priority. Every sensitive operation must align with explicit access policies, encryption standards and full auditing. This ensures that Victor is presented not as a concept, but as a complete, compliant and operationally consistent platform with traceability and regulatory integrity.

Victor Executive App is designed as an aviation-grade, offline-first platform that manages every step of a private or executive flight on the ground, from the moment a flight is created until the final document is generated and shared with authorities. What follows is a unified, step-by-step description of how the system must operate, which data structures it uses and how the mobile app, backend and admin panel interact. This is the functional and technical blueprint you should follow.
The core entity of the system is the flight. Every operation starts from the creation of a flight record inside the app. When the user opens the app and selects the option to create a new flight, the app does not allow free-text entries for airports. Instead, it loads a pre-synchronised list of airports that comes from the backend and is stored locally on the device. Each airport in this list includes its name, IATA code, ICAO code, city, country and timezone. The user selects the origin and destination airports from this structured list. Then the user enters the basic operational data: aircraft registration, aircraft type, MTOW, operator name and address, the date of the operation, the scheduled and actual times of arrival and departure, the captain’s name, the first officer’s name, the number of passengers and crew, as well as the current handling and turnaround status. Once the user saves this flight, the app generates a unique Flight UID and stores the record in encrypted local storage. If a secure connection is available, the flight is immediately synchronised to the backend; if not, it remains offline and will be pushed as soon as connectivity returns. At all times, the airport data are structured and controlled by the central admin panel so that no inconsistent airport names or codes appear in any generated document.
After the flight exists, the next step is the population of passengers. The user opens the specific flight screen and chooses to add a passenger. The application must support three input paths. The first is MRZ scanning, where the device camera reads the machine-readable zone of a passport and extracts the full name, gender, date of birth, nationality, passport number, passport expiry and issuing state. The second is OCR on the visual zone of the passport or ID, for cases where the MRZ is not available or unreadable. The third path is manual entry, where the user inputs the same data fields by hand, or the passenger can be retrieved through an existing QR from a previous flight when that makes operational sense. In all cases, the resulting dataset must contain a full name, gender, date of birth, nationality, passport number, passport expiry, passport country, optional visa number, arrival or departure status, seat number if applicable, baggage count and any operational notes. Once the passenger record is confirmed, the system assigns it a Passenger UID and links it to the corresponding Flight UID. The passenger record is encrypted and stored locally; on the next available connection, it is synchronised to the backend, preserving the relationship between passenger and flight.
Crew follow a parallel but distinct structure. From the same flight screen, the user selects to add a crew member. Data can again be captured via MRZ, OCR or manual entry. However, additional fields are required in order to comply with operational standards, such as rank or position, licence number, licence expiry, nationality and duty type, for example whether the crew member is operating or deadheading. The crew member also has arrival or departure status and may have notes relevant to operations or authorities. Once saved, a Crew UID is created and linked to the Flight UID. The storage and synchronisation logic is the same as for passengers: encrypted local storage and automatic sync when connectivity is restored. Passengers and crew must be clearly separated in the data model and in the generated documents.
The baggage logic must remain simple to use and fully traceable. For every passenger, the user should be able to add baggage entries. Each bag has its own Bag ID, which is linked to the Passenger UID, and contains at least the weight, the number of items and the security or screening status. A timestamp of the scan or creation should also be stored. These baggage items must sync alongside passenger and flight data and be available for any document formats or future load and security reporting modules.
One of the central innovations of Victor Executive App is the Victor QR Pass. This is not a random QR code but a structured, encrypted token that ties together the identity of the person and the flight they belong to. When the user chooses to generate a QR for a passenger or crew member, the app builds a payload that includes the Flight UID, the Passenger or Crew UID, a generation timestamp, an encrypted token, a digital signature and an access level such as passenger, crew, operations staff or authority. It also includes a validity period or expiry time. This payload is encrypted using the Victor cryptographic scheme and rendered as a QR code that can be presented at checkpoints, on the apron or at security points. A separate validation component, either embedded in the app or implemented as a companion tool, scans this QR, verifies the signature and checks whether the token is still valid. If the device is online, the validator may contact the backend to cross-verify the token. If it is offline, it must still be able to decrypt and validate the QR based on the embedded information and keys stored securely on the device. This QR pass must work in low-connectivity environments by design.
Document generation is another core element and must follow a strict, consistent process. Operational users do not upload PDFs manually, nor do they manage templates directly on the device. Instead, the mobile app creates structured data and the backend is responsible for turning those data into compliant documents. When the user wants to generate a General Declaration, a Passenger Manifest, a Crew List or other operational forms, they navigate to the document section of the specific flight and select the document type to generate. At that moment, the app creates a JSON payload that includes all relevant data for the chosen document: full flight details, all passengers with their required fields, all crew, baggage information if needed, timestamps, user and device identifiers and any other required metadata. This JSON payload is sent to the backend through a secure API.
On the backend side, the system receives this JSON and loads the corresponding Victor PDF template. Templates are predefined layouts stored on the server, aligned with ICAO Annex 9, Annex 17 and IATA e-Docs structures. Using a template engine, the backend injects the JSON data into the selected template and generates a final PDF. For example, the General Declaration document will contain the aircraft registration, origin and destination airports, crew details, total number of passengers, purpose of flight, and fields for authority and captain signatures according to the standards. The Passenger Manifest and Crew List will follow their respective formats. Once the PDF is generated, the backend returns it to the app, which allows the user to preview it, store it locally, share it via email, print it, or pass it to an authority. The user can also sign where necessary using a supported digital or scanned signature mechanism. This logic ensures that all documents are always generated from canonical structured data and standardised templates, rather than ad hoc uploaded forms.
The admin panel sits above these operations and has a different role. It is not the place where flights, passengers and everyday operational records are created. Those belong to the mobile app at the edge. The admin panel is where the master data and system configuration live. Through the admin interface, authorised administrators manage the airport database, maintain and update the list of aircraft types and operator profiles, configure and update the PDF templates used in document generation, define and manage user roles and permissions, and access historical logs of flights and generated documents. The admin panel also exposes views and reports for compliance and auditing, such as lists of flights per day, documents generated, QR validation events and synchronisation errors. However, it does not replace the app as the operational entry point. The app is always the origin of operational data; the admin is the management and oversight layer.
Because Victor Executive App is built for ramps and remote aprons where connectivity is unstable, offline behaviour is not an afterthought but a primary architectural principle. Every core operation must work without network access. Creating a flight, adding passengers and crew, assigning baggage, generating QR passes and even generating locally cached documents must be possible when the device is offline. All these actions are stored in an encrypted local database. Each action and record carries a sync status and a timestamp. When the device regains a secure connection, the app pushes all pending changes to the backend, following a deterministic synchronisation strategy. The backend, as system of record, resolves conflicts when the same entity has been modified from different clients and sends back the canonical version. The app then aligns its local data with the server state. Throughout this process, all communication is secured with modern transport-level encryption and, where required, additional payload encryption.
The backend itself is responsible for more than just templates and storage. It must provide user authentication and session management, expose REST APIs and, where appropriate, WebSocket channels for real-time updates, handle the secure storage of flight, passenger, crew, QR and baggage data, perform PDF generation and QR validation, log system actions for audit purposes and provide export endpoints for authorities or external systems if required in future phases. It also manages the master data such as airports and aircraft types and ensures that every change there is propagated correctly to the mobile clients. In terms of architecture, the division is clear: the app is the operational tool on the ground, optimised for offline use and quick data capture, while the backend is the secure, central brain that stores, verifies, generates and exposes.
From an implementation perspective, the sequence is also important. First you need to deliver the solid foundation of flight creation with airport database loading and offline storage. Next comes the passenger module with MRZ and OCR, then the crew module and the baggage association. After that, you implement the Victor QR Pass logic with encryption and validation, followed by the full document generation pipeline from JSON payload to template to PDF. Once these features are stable, you build the synchronisation engine and conflict handling, and finally you complete the admin panel with airport management, template management and audit views. At each step, the behaviour must remain consistent with the end-to-end flow described above, so that a user can start from a blank app, create a flight, populate it, generate a QR and official documents and operate a turnaround even if the network is temporarily absent.
This is the reference model for Victor Executive App. If you implement the app, backend and admin panel in full alignment with these processes and data structures, you will have a platform that is operationally usable, technically coherent and compatible with the regulatory environment it is meant to serve.

So based on this explain, I basically made some guidance technically but feel free to go on your own way and use bellow my technical approaches as reference.

The backend must offer a clear set of endpoints that both the mobile app and the web portal can use.

Step 1: Flights API.
Create endpoints for listing, creating and updating flights, such as:
GET
/api/flights with filters by date, airport and operator.
POST
/api/flights for creation.
PUT
/api/flights/:id for updates.
Ensure all responses use consistent JSON structures that contain ids and references to related entities.
Step 2: Passenger and crew API.
Create endpoints to manage passengers and crew on a specific flight:
GET
/api/flights/:id/passengers
POST
/api/flights/:id/passengers
PUT
/api/passengers/:id
Do the same for crew.
These endpoints will be used both from the app and the web forms.
Step 3: Document and General Declaration API.
Create an endpoint to generate General Declaration from the stored flight, passenger and crew data:
POST
/api/flights/:id/general-declaration/generate which creates the document record and returns its metadata and file URL.
Create GET /api/flights/:id/documents and GET /api/documents/:id to retrieve existing documents.
Step 4: QR Pass API.
Create endpoints for managing QR Pass objects:
POST
/api/flights/:flightId/passengers/:passengerId/qr-pass to create or regenerate a QR Pass for a passenger.
GET
/api/qr-pass/:token to retrieve minimal public data when scanning a QR code at the airport.
This public endpoint must not return full personal and document data, only what is needed for the ground handler in that moment.
Step 5: Baggage API.
Create endpoints such as:
POST
/api/flights/:flightId/baggage to register baggage tags.
POST
/api/baggage/:id/scan to record a scan event, with a status field like loaded or offloaded and a timestamp.
GET
/api/flights/:flightId/baggage to provide the current baggage status overview to handlers and operators.
Step 6: Authority notification API.
Create endpoints to send generated General Declarations and related documents to an authority.
For example POST /api/flights/:id/notify-authority with parameters for the authority type and destination.
Internally, the backend will log the send attempt and its result in AuthorityNotification. 5. Phase 4 – Web portal implementation on the site
The website will host a secure portal for operators, handlers and authorities.
Step 1: Build a single page application inside the site.
Use a modern frontend approach even within WordPress, for example a React app bundled and embedded in a protected page.
This app will call the Victor backend through the APIs created above.
Step 2: Implement login and persistent session.
On login, call /api/auth/login and store the token securely.
For every subsequent request, attach the token as required by the backend.
Handle token expiry by calling /api/auth/refresh or redirecting back to login.
Step 3: Implement main portal screens.
Flights dashboard showing list of flights with filters.
Flight details page with passengers, crew, documents and QR related information.
Edit forms that use the API methods to update data. 6. Phase 5 – Role based access control
Role based access must exist primarily in the backend, and secondarily in the frontend user interface.
Step 1: Define roles and permissions in the backend.
Create a Roles table and a UserRoles relationship if not already present.
Define at least the following roles: VictorAdmin, OperatorAdmin, Handler, AuthorityUser.
Create an internal permission matrix mapping roles to actions and endpoints.
Step 2: Implement authorization middleware.
For every sensitive route in the backend, add a middleware that reads the user role from the token and checks if the action is allowed.
For example, only OperatorAdmin and VictorAdmin can modify flight data.
Handler can change operational status and scan QR codes but cannot see full passenger personal details.
AuthorityUser can see General Declaration, manifest and required personal details, but cannot modify internal operational fields.
Step 3: Adapt frontend according to role.
On login, the frontend reads the role from the token payload and shows only the menus and screens relevant for that role.
Never rely only on frontend hiding. The backend checks must remain the source of truth. 7. Phase 6 – Authority terminal
Authorities need their own dedicated terminal with a reduced, regulated view.
Step 1: Create a distinct frontend entry point such as /authority.
This portal will show only what an authority is allowed to see.
Typical screens are flight list, General Declaration viewer, passenger and crew lists and document download.
Step 2: Restrict API scope.
Use specific endpoints for authorities such as /api/authority/flights and /api/authority/flights/:id/general-declaration.
These endpoints will internally reuse the same data but enforce stricter filters and stronger logging.
Step 3: Implement audit logging.
For any request coming from an authority user, log the user id, authority type, flight id, document id, timestamp and IP or device information.
Store these logs in a dedicated table for traceability and future compliance audits. 8. Phase 7 – Passport scanning and General Declaration pipeline
The Android app will be the entry point for passport data, and the backend will generate the General Declaration automatically.
Step 1: Normalize MRZ and passport scan output.
Ensure the app sends a clear JSON structure to the backend when scanning a passport, containing full name, date of birth, nationality, passport number, country of issue and expiry date.
Step 2: Create backend endpoint for passport data ingestion.
Implement POST /api/flights/:flightId/passport-scan that accepts the scanned data and either creates or updates a Passenger or CrewMember record linked to that flight.
Validate all mandatory fields before saving.
Step 3: Generate General Declaration from stored data.
When the operator requests a General Declaration for a flight, the backend reads all associated passengers and crew, maps them to the General Declaration template and generates the document in PDF and, when needed, in structured form such as XML or JSON.
Return a document id and URL for download or further transmission. 9. Phase 8 – QR Pass service for passengers
The QR Pass will provide the passenger with all necessary flight information and support fast handling at the airport.
Step 1: Create QR Pass generation logic.
When a passenger is confirmed on a flight and the flight has a scheduled departure time, create a QRPass record with a unique token and link it to the passenger and the flight.
Use a secure random generator and store only a reference to the passenger and flight, not personal data inside the token.
Step 2: Implement scheduled job for sending QR Pass.
Create a background job that runs periodically and looks for flights where the scheduled departure minus twenty four hours is within the current time window and where the QR Pass has not yet been sent.
For each such passenger, generate a digital pass page and an attached document if needed, and send an email plus optional SMS with a link and instructions.
Mark the QRPass as sent and log the event.
Step 3: Implement QR Pass scan in the Android app.
Add a dedicated screen in the app for scanning the passenger QR code.
When a code is scanned, the app calls /api/qr-pass/:token and retrieves the relevant flight and passenger operational information.
Allow the handler to update the passenger status such as arrived, ready for boarding and on board, and send this status back to the backend. 10. Phase 9 – Baggage QR and load awareness
Baggage QR codes will help track pieces and associate them with the correct flight and passenger.
Step 1: Implement baggage tag creation.
For each passenger or for the flight in general, generate BaggageTag records with a unique code and link them to the flight and, when applicable, the passenger.
Provide the code to a label printer or to the UI so that the tag can be printed and attached to the luggage.
Step 2: Implement scan events in the app.
Add a baggage scanning mode in the Android app.
On scan, call POST /api/baggage/:id/scan with a status indicating whether the piece is loaded, offloaded or transferred, along with timestamp and optional location.
Update the baggage record with its latest status.
Step 3: Provide baggage overview to operator.
Add a tab in the flight details view on the web portal where the operator can see all baggage tags for that flight and their latest scan status.
This provides a basic baggage tracking view without introducing full airline level systems.

I want well structured, optimized and scalable web admin panel and backend, from above description, just ignore if it mentioned any of the feautre that should be in mobile apps, just learn the workflow of the mobile apps for better admin panel and backend APIs.

Create projects and add detailed comments to codes if necessary. And Create a well structured project structure & workflow documention in detail like how the project was designed technically and how it works etc.
