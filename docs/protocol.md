# DAO Protocol

## Background
The Identity DAO curates a registry of identity entries on the Ethereum blockchain, such that

1. Each address is controlled by a single human identity.
2. No two addresses are controlled by the same human identity.
3. All identity metadata attributed to that address (Full name, Twitter handle, Photo, etc) corresponds to that human identity.

The DAO protocol is designed to achieve this functionality in a manner that is
- *Resilient*: low false negatives, near-0 false positives
- *Scalable*: handles hundreds, and eventually thousands of proposals a day
- *Cheap*: reduces the price of I.D. curation to its marginal cost
- *Incentivized*: distributes the work of I.D. curation through economic incentives

## Overview
The DAO requires users to attach a small fee with their submissions– part of which is returned to the user upon successful submission and the remainder of which pays out correct voters. This fee not only incentivizes voters but also reduces the likelihood of spam proposals.

In order to scale the throughput of decision-making (scalability) without compromising the soundndess of decision-making (resilience), the Identity DAO utilizes the Genesis Protocol.

## Genesis Protocol

The Genesis Protocol achieves holographic consensus by combining a staking game with a reputation-weighted voting game. Here is a high-level overview ([see here for the full protocol spec](https://docs.google.com/document/d/1b3UXvIDjxTVjS1nZNAn0umSY4DT5Y1yJeNHg07ny_5k/edit)).

- Identity proposals go to Queue in which they can be resolved with absolute majority.
- Upstakes and Downstakes are open during Queue.
- Proposals in Queue are scored with Confidence: the ratio of their upstakes and downstakes.
- Proposals are boosted if their Confidence is continuously above Boost Threshold for some time.
- Boosted proposals are open for finite-time voting, at the end of which they’re resolved with relative majority, given a quiet ending.
- The DAO downstakes every proposal in proportion to the average downstake in Boost.

### ID DAO Configuration

| Parameter Name | Description | Initial Value |
|-|-|-|
| Claimable Rep | Reputation that can be claimed by humans that are accepted to the registry. | 100 Rep |
| Incorrect Voter Rep Loss | Proportion of reputation that is debited from incorrect voters and credited to correct voters for a given proposal | 33% |
| Proposal Stake | Returned if proposal succeeds, sent to DAO treasury if proposal fails | 0.09 ETH |
| Proposal Fee| Split among correct voters | 0.01 ETH |

Once deployed, the Identity DAO will likely modify parameter values as the market reveals the true costs of I.D. curation.

To learn more about Rep Curated Registries (RCR), [see here](https://daotalk.org/t/reputation-curated-registries-rcr/655).
