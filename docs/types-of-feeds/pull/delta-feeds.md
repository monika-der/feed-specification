---
sidebar_position: 2
---

# Delta Feeds

Delta feeds is a way of splitting up your inventory to a base feed and then periodically supplying small files with only the changes. This improves the amount of offers and the average time for offer updates by just sending the information changed.

Delta files can be read at a higher frequency and contains offers + an `action field` for each offer that specifies if the offer should be `added/updated/removed`.

## Advantages

- Can handle large volumes (> millions of offers)
- Average time for price update is low (< 10min)

## Disadvantages

- Complex for to setup (requires work on webserver to produce delta files)

## Flow

```mermaid
%%{init: {'theme':'neutral'}}%%
sequenceDiagram
    participant A as Prisjakt Agent
    participant S as Delta Scheduler
    participant F as Your Web Server

    S->>F: Requests feed list every 5 minutes: <Your Delta Base Url>
    F->>S: Responds with a list of urls 
    note over F,S: List contains multiple base urls and deltas per category. 
    note over F,S: May change between requests (delta feeds added)

    loop For each segment/main category
        alt If full read should be done
            note over S,A: Full read happens first time + every week
            S->>A: Initiates ingestion
            A->>F: Requests Feed From Base Url: <Category Base Url>
            F->>A: Responds With Feed
            A->>A: Ingests Feed
        else If delta read should be done
            S->>A: Initiates ingestion
            A->>A: Retrieves last stored delta number and timestamp
            A->>F: Requests next delta feed
            F->>A: Responds with delta feed
            A->>A: Ingests delta feed
            A->>A: Stores last ingested delta number and timestamp
            note over A: We also store a ingestion run for the delta run
        end
    end
```