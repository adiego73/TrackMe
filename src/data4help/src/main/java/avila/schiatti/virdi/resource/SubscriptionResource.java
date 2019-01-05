package avila.schiatti.virdi.resource;

import avila.schiatti.virdi.model.subscription.Subscription;
import org.bson.types.ObjectId;
import xyz.morphia.Datastore;

import java.util.Collection;

public class SubscriptionResource extends Resource<Subscription> {

    /**
     * Only for testing
     */
    public SubscriptionResource(Datastore datastore) {
        super(datastore, Subscription.class);
    }

    private SubscriptionResource() {
        super(Subscription.class);
    }

    public static SubscriptionResource create(){
        return new SubscriptionResource();
    }

    public Collection<Subscription> getAllByIndividual(ObjectId individualId){
        return datastore.find(Subscription.class)
                .field("filter.individual")
                .equal(individualId)
                .asList();
    }

    public Collection<Subscription> getAllByOwner(ObjectId thirPartyId){
        return datastore.find(Subscription.class)
                .field("thirdParty")
                .equal(thirPartyId)
                .asList();
    }

    public Subscription getByOwnerAndId(String thirdPartyId, String sid){
        return datastore.find(Subscription.class)
                .field("id")
                .equal(new ObjectId(sid))
                .field("thirdParty")
                .equal(new ObjectId(thirdPartyId))
                .get();
    }
}
